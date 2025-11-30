// Vercel 서버리스 함수 - 모든 API 요청을 EC2로 프록시
export default async function handler(req, res) {
  // 모든 HTTP 메서드 허용
  const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];
  
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', allowedMethods.join(','));
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id');

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 지원하지 않는 메서드 체크
  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // EC2 백엔드 URL (환경변수에서 가져오거나 기본값 사용)
  const BACKEND_URL = process.env.VITE_API_URL || process.env.BACKEND_URL || 'http://3.38.145.117:3000';
  
  // 요청 경로 구성 - Vercel의 동적 라우팅 처리
  let path = '';
  if (req.query.path) {
    if (Array.isArray(req.query.path)) {
      path = req.query.path.join('/');
    } else {
      path = req.query.path;
    }
  }
  
  const apiPath = path ? `/api/${path}` : '/api';
  
  // 쿼리 파라미터 구성 (path 제외)
  const queryParams = Object.keys(req.query)
    .filter(key => key !== 'path')
    .map(key => {
      const value = req.query[key];
      return `${encodeURIComponent(key)}=${encodeURIComponent(Array.isArray(value) ? value.join(',') : value)}`;
    })
    .join('&');
  const queryString = queryParams ? `?${queryParams}` : '';
  
  // 최종 URL
  const targetUrl = `${BACKEND_URL}${apiPath}${queryString}`;

  try {
    // 요청 헤더 구성 (Authorization, x-user-id 등 전달)
    const headers = {};

    // 모든 헤더 전달 (단, host, connection 등은 제외)
    const excludeHeaders = ['host', 'connection', 'content-length', 'transfer-encoding'];
    Object.keys(req.headers).forEach(key => {
      const lowerKey = key.toLowerCase();
      if (!excludeHeaders.includes(lowerKey)) {
        headers[key] = req.headers[key];
      }
    });

    // Content-Type이 없으면 기본값 설정
    if (!headers['Content-Type'] && req.method !== 'GET' && req.method !== 'DELETE') {
      headers['Content-Type'] = 'application/json';
    }

    // 요청 옵션
    const fetchOptions = {
      method: req.method,
      headers,
    };

    // GET, DELETE가 아닌 경우 body 전달
    if (req.method !== 'GET' && req.method !== 'DELETE') {
      if (req.body) {
        // FormData인 경우 특별 처리
        if (req.headers['content-type']?.includes('multipart/form-data')) {
          // multipart/form-data는 그대로 전달
          fetchOptions.body = req.body;
        } else {
          // JSON인 경우 문자열화
          fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
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
    response.headers.forEach((value, key) => {
      // CORS 관련 헤더는 제외
      if (!key.toLowerCase().startsWith('access-control-')) {
        res.setHeader(key, value);
      }
    });

    // 응답 반환
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('프록시 에러:', error);
    console.error('요청 URL:', targetUrl);
    console.error('요청 메서드:', req.method);
    return res.status(500).json({
      error: '프록시 요청 실패',
      message: error.message,
      url: targetUrl,
    });
  }
}

