import datetime
import json
import requests
import pandas as pd


def get_nav_data_from_api(mf_id):
    resp = requests.get(f"https://www.valueresearchonline.com/api/funds/trailing-returns-chart/{mf_id}")
    return json.loads(resp.content)[1][0]['data']


def get_nav_data(mf_id, insert_holiday_dates=True):
    resp_nav_data = get_nav_data_from_api(mf_id)
    nav_data = []
    previous_ts = 0
    current_nav = None
    for i in resp_nav_data:
        current_ts = i[0] / 1000
        if insert_holiday_dates and current_nav is not None:
            insert_holiday_date_nav(nav_data, current_ts, previous_ts, current_nav, data_format="dataframe")

        date = datetime.date.fromtimestamp(current_ts)
        current_nav = i[1]
        nav_data.append({
            "year": date.year,
            "month": date.month,
            "day": date.day,
            "nav": current_nav
        })
        previous_ts = current_ts
    return pd.DataFrame(nav_data)


def get_nav_data_dict(mf_id, insert_holiday_dates=True):
    resp_nav_data = get_nav_data_from_api(mf_id)
    nav_dict = {}
    previous_ts = 0
    current_nav = None
    for i in resp_nav_data:
        current_ts = i[0] / 1000
        if insert_holiday_dates and current_nav is not None:
            insert_holiday_date_nav(nav_dict, current_ts, previous_ts, current_nav, data_format="dict")

        date = datetime.date.fromtimestamp(current_ts)
        current_nav = i[1]
        nav_dict[date] = current_nav
        previous_ts = current_ts
    return nav_dict


def insert_holiday_date_nav(nav_data, current_ts, previous_ts, current_nav, data_format):
    diff = current_ts - previous_ts
    while diff > 86400:
        date = datetime.datetime.fromtimestamp(previous_ts + 86400)
        if data_format == "dataframe":
            nav_data.append({
                "year": date.year,
                "month": date.month,
                "day": date.day,
                "nav": current_nav
            })
        elif data_format == "dict":
            nav_data[datetime.datetime.date(date)] = current_nav
        previous_ts += 86400
        diff = current_ts - previous_ts


def get_current_nav(nav_df):
    return nav_df.iloc[-1]["nav"]


def get_cagr(new_value, old_value, timeframe):
    cagr = ((new_value/old_value)**(1/timeframe)-1) * 100
    return round(cagr, 2)


def get_rolling_returns(mf_id, time_frame):
    '''
    :param nav_df: dict with date to nav mapping
    :param time_frame: time frame for rolling return calculation in years
    :return: list of lists each list of form [timestamp, rolling_return]
    '''
    nav_dict = get_nav_data_dict(mf_id)
    rolling_returns_list = []
    for item in sorted(nav_dict.items(), reverse=True):
        date = item[0]
        try:
            new_nav = nav_dict[date]
            old_nav = nav_dict[date - datetime.timedelta(days=time_frame * 365)]
            cagr = get_cagr(new_nav, old_nav, time_frame)
            ts = datetime.datetime.combine(date, datetime.datetime.min.time()).timestamp()
            rolling_returns_list.append([ts * 1000, cagr])
        except KeyError:
            break
    return rolling_returns_list
