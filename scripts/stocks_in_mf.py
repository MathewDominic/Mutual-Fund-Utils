import operator
import requests

from bs4 import BeautifulSoup
from collections import defaultdict
from scripts.constants import MF_TO_ID_DICT


def get_mf_stock_holdings_percent(mf_id):
    '''accepts value researh mf id and returns dict of indivigual stocs percentage in portfolio'''
    url = "https://www.valueresearchonline.com/funds/portfoliovr.asp"
    querystring = {"schemecode": str(mf_id)}

    headers = {
        'Accept': "*/*",
        'Cache-Control': "no-cache",
        'Host': "www.valueresearchonline.com",
        'Accept-Encoding': "gzip, deflate",
        'Connection': "keep-alive",
    }

    response = requests.request("GET", url, headers=headers, params=querystring)
    soup = BeautifulSoup(response.text)
    table = soup.find(lambda tag:
                      tag.name == 'table'
                      and tag.has_attr('id')
                      and tag['id'] == "fund-snapshot-port-holdings")
    rows = table.find_all('tr')
    stock_holdings_percent = {}
    for i, row in enumerate(rows):
        if i < 2:
            continue
        cols = row.find_all('td')
        stock_holdings_percent[cols[1].text.strip()] = float(cols[6].text)
    return stock_holdings_percent


def get_stocks_in_mf_value(mf_ids, amounts):
    '''
    function which accepts dict with key as mf name in VR and value as amount invested in mf
    returns value of holdings in individual stocks
    '''
    stock_value_dict = defaultdict(lambda: 0)
    for index, mf_id in enumerate(mf_ids):
        if amounts[index] == 0:
            continue
        stock_to_holdings_percent_dict = get_mf_stock_holdings_percent(mf_id)
        for stock in stock_to_holdings_percent_dict:
            stock_value_dict[stock] += stock_to_holdings_percent_dict[stock] * amounts[index] / 100
    return sorted(stock_value_dict.items(), key=operator.itemgetter(1), reverse=True)


# stocks_in_mf_value = get_stocks_in_mf_value({
#     "Axis Bluechip Fund - Direct Plan(Erstwhile Axis Equity)": 35000,
#     "Parag Parikh Long Term Equity Fund - Direct Plan(Erstwhile Parag Parikh Long Term Value Fund)": 30000,
#     "Kotak Standard Multicap Fund - Direct Plan  (Erstwhile Kotak Select Focus)": 50000,
#     "Principal Hybrid Equity Fund - Direct Plan": 30000,
#     "UTI Nifty Index Fund - Direct Plan": 22000
# })
# pass
