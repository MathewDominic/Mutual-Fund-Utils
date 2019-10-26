import json

from flask import Flask, jsonify, request
from flask_cors import CORS
from scripts.stocks_in_mf import get_stocks_in_mf_value
from scripts.constants import MF_TO_ID_DICT

app = Flask(__name__)
CORS(app)


@app.route('/')
def hello_world():
    return 'Hello, World from Flask!'


@app.route('/getAllMfs')
def get_all_mfs():
    response = jsonify(MF_TO_ID_DICT)
    return response


@app.route('/getHoldings', methods=['POST'])
def get_all_holdings():
    params = json.loads(request.data.decode('utf-8'))
    stock_value_in_mfs = get_stocks_in_mf_value(list(map(int, params['mfs'])), list(map(int, params['amounts'])))
    response = jsonify({
        "data": stock_value_in_mfs
    })
    return response
