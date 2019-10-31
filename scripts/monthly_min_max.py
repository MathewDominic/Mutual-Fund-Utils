from scripts.constants import MF_TO_ID_DICT
from scripts import util


def sip_date_diff(mf_id, sip_amount):
    nav_df = util.get_nav_data(mf_id)

    monthwise_min = nav_df.loc[nav_df.groupby(["year", "month"])["nav"].idxmin()]
    monthwise_max = nav_df.loc[nav_df.groupby(["year", "month"])["nav"].idxmax()]

    max_units, min_units = 0, 0
    current_nav = util.get_current_nav(nav_df)
    for _, row in monthwise_min.iterrows():
        max_units += sip_amount/row["nav"]
    max_amount = current_nav * max_units
    for _, row in monthwise_max.iterrows():
        min_units += sip_amount/row["nav"]
    min_amount = current_nav * min_units
    percentage_diff = ((max_amount/min_amount)-1)*100
    print(percentage_diff)


if __name__ == "__main__":
    for fund in MF_TO_ID_DICT:
        print(fund)
        sip_date_diff(MF_TO_ID_DICT[fund], 5000)

'''
js script to fetch mf name and id 
for(var row in $0.children) {
    var fundName = $0.children[row].children[0].children[0].text.split("\n")
    console.log('"' + fundName[0] + (fundName[1] ? fundName[1] : "") + '":',  
    $0.children[row].children[0].children[0].href.split("=")[1] + ',')
}
'''