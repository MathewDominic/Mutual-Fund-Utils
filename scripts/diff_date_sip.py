import operator
from scripts import util
from scripts.constants import MF_TO_ID_DICT


def get_sip_num_of_units(nav_on_day, sip_amount):
    units = 0
    for _, row in nav_on_day.iterrows():
        units += sip_amount / row["nav"]
    return units

def get_diff_date_sip_diff(mf_id, sip_amount):
    nav_df = util.get_nav_data_dataframe(mf_id, insert_holiday_dates=True)
    amount_on_date = {}
    for i in range(1, 29):
        nav_on_day = nav_df[nav_df["day"] == i]
        units = get_sip_num_of_units(nav_on_day, sip_amount)
        amount_on_date[i] = units * util.get_current_nav(nav_df)

    max_amount = max(amount_on_date.items(), key=operator.itemgetter(1))[1]
    min_amount = min(amount_on_date.items(), key=operator.itemgetter(1))[1]
    return round((max_amount/min_amount - 1) * 100, 2)


if __name__ == "__main__":
    for fund in MF_TO_ID_DICT:
        print(fund)
        print(f'Percentage difference {get_diff_date_sip_diff(MF_TO_ID_DICT[fund], 5000)}')
