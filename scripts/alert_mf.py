import math
import requests
import datetime
import pandas as pd
from bs4 import BeautifulSoup


def get_nav_data(mf_id, sc_id, start_date, end_date=None):
    dates = []
    navs = []
    d1 = datetime.datetime.strptime(start_date, "%Y-%m-%d")
    if end_date is None:
        end_date = datetime.datetime.now()
    else:
        end_date = datetime.datetime.strptime(end_date, "%Y-%m-%d")

    if d1 + datetime.timedelta(days=89) > datetime.datetime.now():
        d2 = datetime.datetime.now()
    else:
        d2 = d1 + datetime.timedelta(days=89)


    while d1 <= end_date:
        a = requests.post("https://www.amfiindia.com/modules/NavHistoryPeriod",
                         data={
                            "mfID": str(mf_id),
                            "scID": str(sc_id),
                            "fDate": d1.strftime("%d-%b-%Y"),
                            "tDate": d2.strftime("%d-%b-%Y")
                         })
        d1 = d1 + datetime.timedelta(days=90)
        d2 = d1 + datetime.timedelta(days=89)

        soup = BeautifulSoup(a.text)
        if soup.text.find('No records') > -1:
            continue
        table = soup.find(lambda tag: tag.name == 'table' and tag.has_attr('class'))
        table_body = table.find('tbody')

        rows = table_body.find_all('tr')
        for row in rows:
            cols = row.find_all('td')
            cols = [ele.text.strip() for ele in cols]
            if len(cols) > 0:
                dates.append(datetime.datetime.strptime(cols[3], "%d-%b-%Y"))
                navs.append(float(cols[0]))

    ma = pd.DataFrame(navs).rolling(window=30).mean().values.tolist()
    indexes = [i for i in range(len(ma)) if not math.isnan(ma[i][0]) and (ma[i][0] - 0.03 * ma[i][0]) > navs[i]]
    for i in indexes:
        print(dates[i], navs[i], round(ma[i][0],2), (ma[i][0]-navs[i])/ma[i][0]*100)
    pass


get_nav_data(27, 118525, "2019-01-01")