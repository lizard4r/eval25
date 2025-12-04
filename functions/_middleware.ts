const BASIC_USER = "admin";
const BASIC_PASS = "eval2025";

async function errorHandling(context: EventContext<unknown, string, unknown>) {
  try {
    return await context.next();
  } catch (err) {
    return new Response(`${err}`, { status: 500 });
  }
}

async function authentication(context: EventContext<unknown, string, unknown>) {
  const authorization = context.request.headers.get("Authorization");

  if (!authorization) {
    return new Response("인증이 필요합니다.", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="2025년 경영평가 작성 도구", charset="UTF-8"',
      },
    });
  }

  const [scheme, encoded] = authorization.split(" ");

  if (!encoded || scheme !== "Basic") {
    return new Response("잘못된 인증 형식입니다.", {
      status: 400,
    });
  }

  const decoded = atob(encoded);
  const [user, pass] = decoded.split(":");

  if (user !== BASIC_USER || pass !== BASIC_PASS) {
    return new Response("사용자명 또는 비밀번호가 잘못되었습니다.", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="2025년 경영평가 작성 도구", charset="UTF-8"',
      },
    });
  }

  return await context.next();
}

export const onRequest = [errorHandling, authentication];
