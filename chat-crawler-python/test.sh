#!/bin/bash

# 출력 제거
pipenv install > /dev/null 2>&1 
PYTHONUNBUFFERED=1 pipenv run python test.py # 출력 버퍼링 해제 (for pipe)
