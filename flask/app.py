import json

from flask import Flask, jsonify, request
from flask_cors import CORS
from scripts.util import get_rolling_returns
from scripts.stocks_in_mf import get_stocks_in_mf_value
from scripts.constants import MF_TO_ID_DICT

app = Flask(__name__)
CORS(app)


@app.route('/')
def hello_world():
    return 'Hello, World from Flask!'


@app.route('/getAllMfs')
def get_all_mfs():
    response = jsonify(dict((v, k) for k, v in MF_TO_ID_DICT.items()))
    return response


@app.route('/stockHoldings', methods=['POST'])
def stock_holdings():
    params = json.loads(request.data.decode('utf-8'))
    stock_value_in_mfs = get_stocks_in_mf_value(
        [MF_TO_ID_DICT[x] for x in params['mfs'] if x != ''],
        params['amounts']
    )
    response = jsonify(stock_value_in_mfs)
    return response


@app.route('/rollingReturns', methods=['POST'])
def rolling_returns():
    params = json.loads(request.data.decode('utf-8'))
    response = jsonify({
        params['mfs'][0]: get_rolling_returns(MF_TO_ID_DICT[params['mfs'][0]], params['timeFrame']),
        params['mfs'][1]: get_rolling_returns(MF_TO_ID_DICT[params['mfs'][1]], params['timeFrame'])
    })
    return response


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)
