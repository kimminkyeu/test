import time

# 파이썬의 기본 출력은 버퍼링이 되기 때문에
# flush=True를 사용하여 버퍼를 비워준다.
while True:
    print("hello")
    time.sleep(1)