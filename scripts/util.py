import datetime
import json
import requests
import pandas as pd


def get_nav_data_dataframe(mf_id, insert_holiday_dates=False):
    resp = requests.get(f"https://www.valueresearchonline.com/funds/fundVSindex.asp?Sch={mf_id}&obj=equity")
    resp_nav_data = json.loads(resp.content)[1][0]['data']
    nav_data = []
    previous_ts = 0
    current_nav = None
    for i in resp_nav_data:
        current_ts = i[0] / 1000
        if insert_holiday_dates and current_nav is not None:
            insert_holiday_date_nav(nav_data, current_ts, previous_ts, current_nav)

        date = datetime.datetime.fromtimestamp(current_ts)
        current_nav = i[1]
        nav_data.append({
            "year": date.year,
            "month": date.month,
            "day": date.day,
            "nav": current_nav
        })
        previous_ts = current_ts

    return pd.DataFrame(nav_data)


def insert_holiday_date_nav(nav_data, current_ts, previous_ts, current_nav):
    diff = current_ts - previous_ts
    while diff > 86400:
        date = datetime.datetime.fromtimestamp(previous_ts + 86400)
        nav_data.append({
            "year": date.year,
            "month": date.month,
            "day": date.day,
            "nav": current_nav
        })
        previous_ts += 86400
        diff = current_ts - previous_ts


def get_current_nav(nav_df):
    return nav_df.iloc[-1]["nav"]