import json
import scripts.util as util
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
    stock_value_in_mfs = get_stocks_in_mf_value(
        [MF_TO_ID_DICT[x] for x in params['mfs'] if x != ''],
        params['amounts']
    )
    response = jsonify(stock_value_in_mfs)
    return response

@app.route('/getRollingReturns', methods=['POST', 'GET'])
def get_rolling_returns():
    params = json.loads(request.data.decode('utf-8'))
    response = jsonify({
        params['mfs'][0]: util.get_rolling_returns(MF_TO_ID_DICT[params['mfs'][0]], params['timeFrame']),
        params['mfs'][1]: util.get_rolling_returns(MF_TO_ID_DICT[params['mfs'][1]], params['timeFrame'])
    })
    return response