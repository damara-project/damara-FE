// Vercel 서버리스 함수 - 모든 API 요청을 EC2로 프록시
export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id');

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // EC2 백엔드 URL (환경변수에서 가져오거나 기본값 사용)
  const BACKEND_URL = process.env.VITE_API_URL || 'http://3.38.xxx.xxx:3000';
  
  // 요청 경로 구성
  const path = Array.isArray(req.query.path) 
    ? req.query.path.join('/') 
    : req.query.path || '';
  
  const apiPath = path ? `/api/${path}` : '/api';
  
  // 쿼리 파라미터 구성 (path 제외)
  const queryParams = Object.keys(req.query)
    .filter(key => key !== 'path')
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(req.query[key])}`)
    .join('&');
  const queryString = queryParams ? `?${queryParams}` : '';
  
  // 최종 URL
  const targetUrl = `${BACKEND_URL}${apiPath}${queryString}`;

  try {
    // 요청 헤더 구성 (Authorization, x-user-id 등 전달)
    const headers = {};

    // Content-Type 설정 (multipart/form-data인 경우 제외)
    if (req.headers['content-type'] && !req.headers['content-type'].includes('multipart/form-data')) {
      headers['Content-Type'] = req.headers['content-type'];
    }

    if (req.headers.authorization) {
      headers.Authorization = req.headers.authorization;
    }

    if (req.headers['x-user-id']) {
      headers['x-user-id'] = req.headers['x-user-id'];
    }

    // 요청 옵션
    const fetchOptions = {
      method: req.method,
      headers,
    };

    // GET, DELETE가 아닌 경우 body 전달
    if (req.method !== 'GET' && req.method !== 'DELETE') {
      // FormData인 경우 특별 처리
      if (req.headers['content-type']?.includes('multipart/form-data')) {
        // Vercel 서버리스 함수에서는 multipart/form-data를 직접 처리하기 어려움
        // 따라서 body를 Buffer로 변환하여 전달
        // 실제로는 axios가 보낸 FormData를 그대로 전달해야 함
        // 하지만 서버리스 함수에서는 req.body가 이미 파싱된 상태이므로
        // 원본 요청의 body를 그대로 전달하는 것이 어려움
        // 대신 FormData를 재구성하거나, raw body를 받아야 함
        
        // 임시 해결책: body를 그대로 전달 (Vercel이 자동으로 처리)
        fetchOptions.body = req.body;
        // Content-Type은 boundary를 포함해야 하므로 원본 헤더 사용
        if (req.headers['content-type']) {
          headers['Content-Type'] = req.headers['content-type'];
        }
      } else if (req.body) {
        fetchOptions.body = JSON.stringify(req.body);
        if (!headers['Content-Type']) {
          headers['Content-Type'] = 'application/json';
        }
      }
    }

    // EC2로 요청 전송
    const response = await fetch(targetUrl, fetchOptions);

    // 응답 데이터 파싱
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // 응답 헤더 전달
    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      // CORS 관련 헤더는 제외
      if (!key.toLowerCase().startsWith('access-control-')) {
        responseHeaders[key] = value;
      }
    });

    // 응답 반환
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('프록시 에러:', error);
    return res.status(500).json({
      error: '프록시 요청 실패',
      message: error.message,
    });
  }
}

