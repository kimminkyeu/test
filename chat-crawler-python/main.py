import certifi
import ssl 
import asyncio
import websockets
from api import get_player_live
import sys
import json

# 유니코드 및 기타 상수
F = "\x0c"
ESC = "\x1b\t"
SEPARATOR = "+++++++++++++++++++++++++++++++++++++++++" # 구분자 삭제

# SSL 컨텍스트 생성
def create_ssl_context():
    ssl_context = ssl.create_default_context()
    ssl_context.load_verify_locations(certifi.where())
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    return ssl_context

# 메시지 디코드 및 출력
def decode_message(bytes):
    parts = bytes.split(b'\x0c')
    messages = [part.decode('utf-8') for part in parts]
    # 메시지 길이가 13자인 경우가 일반 채팅인 것 까지 확인. 별풍선이나 다른건 더 테스트 해봐야 한다.
    if len(messages) == 13 and messages[1] not in ['-1', '1'] and '|' not in messages[1]:
        # print(messages)
        # print(len(messages))
        x = {
            'user_id': messages[2],
            'user_nickname': messages[6],
            'comment': messages[1],
        }
        # print(SEPARATOR)
        print(json.dumps(x, ensure_ascii=False))
    else:
        # 채팅 뿐만 아니라 다른 메세지도 동시에 내려옵니다.
        pass

# 바이트 크기 계산
def calculate_byte_size(string):
    return len(string.encode('utf-8')) + 6

# 채팅에 연결
async def connect_to_chat(url, ssl_context):
    try:
        BNO, BID = url.split('/')[-1], url.split('/')[-2]
        CHDOMAIN, CHATNO, FTK, TITLE, BJID, CHPT = get_player_live(BNO, BID)
        x = {
            'CHDOMAIN': CHDOMAIN,
            'CHATNO': CHATNO,
            'FTK': FTK,
            'TITLE': TITLE,
            'BJID': BJID,
            'CHPT': CHPT
        }
        # print(f"{SEPARATOR}\n"
        #       f"  CHDOMAIN: {CHDOMAIN}\n  CHATNO: {CHATNO}\n  FTK: {FTK}\n"
        #       f"  TITLE: {TITLE}\n  BJID: {BJID}\n  CHPT: {CHPT}\n"
        #       f"{SEPARATOR}")
        print(json.dumps(x, ensure_ascii=False))
    except Exception as e:
        print(f"  ERROR: API 호출 실패 - {e}")
        sys.exit(1)
        # return

    try:
        async with websockets.connect(
            f"wss://{CHDOMAIN}:{CHPT}/Websocket/{BID}",
            subprotocols=['chat'],
            ssl=ssl_context,
            ping_interval=None
        ) as websocket:
            # 최초 연결시 전달하는 패킷
            CONNECT_PACKET = f'{ESC}000100000600{F*3}16{F}'
            # 메세지를 내려받기 위해 보내는 패킷
            JOIN_PACKET = f'{ESC}0002{calculate_byte_size(CHATNO):06}00{F}{CHATNO}{F*5}'
            # 주기적으로 핑을 보내서 메세지를 계속 수신하는 패킷
            PING_PACKET = f'{ESC}000000000100{F}'

            await websocket.send(CONNECT_PACKET)
            # print(f"  연결 성공, 채팅방 정보 수신 대기중...")
            await asyncio.sleep(2)
            await websocket.send(JOIN_PACKET)

            async def ping():
                while True:
                    # 5분동안 핑이 보내지지 않으면 소켓은 끊어집니다.
                    await asyncio.sleep(60)  # 1분 = 60초
                    await websocket.send(PING_PACKET)
            
            async def receive_messages():
                while True:
                    data = await websocket.recv()
                    decode_message(data)
            
            await asyncio.gather(
                receive_messages(),
                ping(),
            )

    except Exception as e:
        print(f"  ERROR: 웹소켓 연결 오류 - {e}")
        sys.exit(1)

async def main():
    if len(sys.argv) != 2:
        print("Must provide SOOP live URL")
        sys.exit(1)
    url = sys.argv[1]
    ssl_context = create_ssl_context()
    await connect_to_chat(url, ssl_context)

if __name__ == "__main__":
    asyncio.run(main())

