import json

from flask import Flask, jsonify, request
from flask_cors import CORS
from scripts.util import get_rolling_returns
from scripts.stocks_in_mf import get_stocks_in_mf_value
from scripts.constants import MF_TO_ID_DICT

from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://{user}:{pw}@{url}/{db}'.format(
    user='eerqlbnbznbmgt',
    pw='c15c29e435d944d640e7ddcc4b38b493f4ae0468b3598c297a0dd3d08474f41c',
    url='ec2-107-21-120-104.compute-1.amazonaws.com',
    db='dcl5agm2tj9fmn')

db = SQLAlchemy(app)





class Google(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)
    name = db.Column(db.String(80))
    rating = db.Column(db.Float)
    tag = db.Column(db.String(80))
    photo_url = db.Column(db.String(80))

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


@app.route('/')
def hello_world():
    r = Google.query.all()
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


@app.route('/bangalore', methods=['GET'])
def bangalore():
    tags = ('shopping_mall', 'museum')
    lmt = 10
    return jsonify([i.as_dict() for i in Google.query.filter(Google.tag.in_(tags)).limit(lmt)])


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)