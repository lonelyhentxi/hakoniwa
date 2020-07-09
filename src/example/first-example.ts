const serverTime = Math.floor(Date.now() / 1000);

const body = {
    popup: true,
    end_time_stamp: serverTime + 1000,
    amount: '0.01',
    count_down_type: 0,
    server_time: serverTime,
    pop_window_type: 2,
    corner_modal_type: 1,
};

const apiSchema =
`^**/proxy/api/api/growth/spain/landing_page/yfg_entry resMerge://(${JSON.stringify(body)})`;

console.log(apiSchema);