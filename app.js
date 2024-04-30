const oracledb = require('oracledb');
oracledb.initOracleClient({libDir: "./instantclient_19_8"})
try {
  oracledb.initOracleClient({ libDir: '/instantclient_19_8' }); // Oracle Instant Client 경로 설정 필요
} catch (err) {
  console.error('Whoops!', err);
  process.exit(1);
}

const app = express();
const port = 3000;

async function connectToDB() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: 'C##ONLINE_WEB', // Oracle 사용자 이름
      password: '1111',      // 비밀번호
      connectString: 'localhost/XE' // 접속 스트링
    });

    console.log('Oracle 데이터베이스에 성공적으로 연결되었습니다.');
    const result = await connection.execute(`SELECT 1 + 1 FROM dual`);
    console.log('쿼리 결과:', result.rows[0][0]); // 쿼리 결과 출력

  } catch (err) {
    console.error('데이터베이스 연결 실패:', err);
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log('데이터베이스 연결이 성공적으로 종료되었습니다.');
      } catch (err) {
        console.error(err);
      }
    }
  }
}

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`서버가 ${port}번 포트에서 실행 중입니다.`);
  connectToDB(); // 서버 시작 시 데이터베이스 연결 시도
});
