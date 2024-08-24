export interface Metric {
  no?: number,
  label: string;
  value: any;
  unit: any;
  children?: Metric[];
}

export const data = {
  title: {
    thoi_gian_tong_hop_du_lieu_gan_nhat: '10/08/2024 12:08:23',
    thoi_gian_xuat_du_lieu:
      new Date().toLocaleDateString('en-GB') + new Date().toLocaleTimeString(),
    nguoi_xuat: 'Vũ Thị Thảo Giang',
  }
};

export const userKpi: Metric[] = [
  {
    no: 1,
    label: 'Thời gian hoạt động của hệ thống',
    value: null,
    unit: null,
    children: [
      {
        label: 'Tỉ lệ khả dụng (%)',
        value: '80',
        unit: '%',
      },
    ],
  },
  {
    no: 2,
    label: 'Thời gian phàn hồi trung bình',
    value: null,
    unit: null,
    children: [
      {
        label: 'Thời gian phản hồi trung bình',
        value: 'Giá trị',
        unit: null,
      },
    ],
  },
  {
    no: 3,
    label: 'Yêu cầu bị từ chối',
    value: null,
    unit: null,
    children: [
      {
        label: 'Tổng yêu cầu',
        value: 'Giá trị',
        unit: null,
      },
      {
        label: 'Giá trị bị từ chối',
        value: 'Giá trị',
        unit: 'Tỉ lệ',
      },
    ],
  },
  {
    no: 4,
    label: 'Thời gian xử lí trung bình',
    value: null,
    unit: null,
    children: [
      {
        label: 'Thu thập thủ công',
        value: 'Giá trị',
        unit: null,
      },
      {
        label: 'Thu thập tự động',
        value: 'Giá trị',
        unit: null,
      },
      {
        label: 'Dò tìm thủ công',
        value: 'Giá trị',
        unit: null,
      },
      {
        label: 'Dò tìm tự động',
        value: 'Giá trị',
        unit: null,
      },
      {
        label: 'Scan',
        value: 'Giá trị',
        unit: null,
      },
      {
        label: 'Dừng thu thập',
        value: 'Giá trị',
        unit: null,
      },
      {
        label: 'Dừng dò tìm',
        value: "Giá trị",
        unit: null
      },
      {
        label: "Điều chỉnh công suất trạm chính",
        value: "Giá trị",
        unit: null
      },
      {
        label: "Điều chỉnh công suất trạm phụ",
        value: "Giá trị",
        unit: null
      }
    ],
  },
  {
    no: 5,
    label: "Giao dịch thành công",
    value: null,
    unit: null,
    children: [
        {
            label: 'Nhà mạng Viettel',
            value: "Giá trị",
            unit: null,
            children: [
                {
                    label: "Số lượng giao dịch thành công",
                    value: "Giá trị",
                    unit: null
                },
                {
                    label: "Thu thập thủ công",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Thu thập tự động",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Dò tìm thủ công",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Dò tìm tự động",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Scan môi trường",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Dừng thu thập",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Dừng dò tìm",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Điều chỉnh công suất trạm",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                }
            ]
        },
        {
            label: 'Nhà mạng Vinaphone',
            value: "Giá trị",
            unit: null,
            children: [
                {
                    label: "Số lượng giao dịch thành công",
                    value: "Giá trị",
                    unit: null
                },
                {
                    label: "Thu thập thủ công",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Thu thập tự động",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Dò tìm thủ công",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Dò tìm tự động",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Scan môi trường",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Dừng thu thập",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Dừng dò tìm",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Điều chỉnh công suất trạm",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                }
            ]
        },
        {
            label: 'Nhà mạng Mobilephone',
            value: "Giá trị",
            unit: null,
            children: [
                {
                    label: "Số lượng giao dịch thành công",
                    value: "Giá trị",
                    unit: null
                },
                {
                    label: "Thu thập thủ công",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Thu thập tự động",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Dò tìm thủ công",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Dò tìm tự động",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Scan môi trường",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Dừng thu thập",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Dừng dò tìm",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Điều chỉnh công suất trạm",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                }
            ]
        },
        {
            label: 'Nhà mạng Vietnammobile',
            value: "Giá trị",
            unit: null,
            children: [
                {
                    label: "Số lượng giao dịch thành công",
                    value: "Giá trị",
                    unit: null
                },
                {
                    label: "Thu thập thủ công",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Thu thập tự động",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Dò tìm thủ công",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Dò tìm tự động",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Scan môi trường",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Dừng thu thập",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Dừng dò tìm",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Điều chỉnh công suất trạm",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                }
            ]
        }
    ]
  },
  {
    no: 6,
    label: "Tỉ lệ sử dụng",
    value: null,
    unit: null,
    children: [
        {
            label: 'Nhà mạng Viettel',
            value: "Giá trị",
            unit: null,
            children: [
                {
                    label: "Số lần sử dụng tất cả các tính năng trong đó: ",
                    value: 'Giá trị',
                    unit: null
                },
                {
                    label: "Thu thập thủ công",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Thu thập tự động",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                }, 
                {
                    label: "Thu thập sử dụng địa điểm có sẵn",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Dò tìm thủ công",
                    value: "Giá trị",
                    unit: "Tie lệ"
                },
                {
                    label: "Dò tìm tự động",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Dò tìm sử dụng địa điểm có sẵn",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                }
            ]
        },
        {
            label: 'Nhà mạng Vinaphone',
            value: "Giá trị",
            unit: null,
            children: [
                {
                    label: "Số lần sử dụng tất cả các tính năng trong đó: ",
                    value: 'Giá trị',
                    unit: null
                },
                {
                    label: "Thu thập thủ công",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Thu thập tự động",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                }, 
                {
                    label: "Thu thập sử dụng địa điểm có sẵn",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Dò tìm thủ công",
                    value: "Giá trị",
                    unit: "Tie lệ"
                },
                {
                    label: "Dò tìm tự động",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Dò tìm sử dụng địa điểm có sẵn",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                }
            ]
        },
        {
            label: 'Nhà mạng Mobilephone',
            value: "Giá trị",
            unit: null,
            children: [
                {
                    label: "Số lần sử dụng tất cả các tính năng trong đó: ",
                    value: 'Giá trị',
                    unit: null
                },
                {
                    label: "Thu thập thủ công",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Thu thập tự động",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                }, 
                {
                    label: "Thu thập sử dụng địa điểm có sẵn",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Dò tìm thủ công",
                    value: "Giá trị",
                    unit: "Tie lệ"
                },
                {
                    label: "Dò tìm tự động",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Dò tìm sử dụng địa điểm có sẵn",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                }
            ]
        },
        {
            label: 'Nhà mạng Vietnamemobile',
            value: "Giá trị",
            unit: null,
            children: [
                {
                    label: "Số lần sử dụng tất cả các tính năng trong đó: ",
                    value: 'Giá trị',
                    unit: null
                },
                {
                    label: "Thu thập thủ công",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Thu thập tự động",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                }, 
                {
                    label: "Thu thập sử dụng địa điểm có sẵn",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Dò tìm thủ công",
                    value: "Giá trị",
                    unit: "Tie lệ"
                },
                {
                    label: "Dò tìm tự động",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                },
                {
                    label: "Dò tìm sử dụng địa điểm có sẵn",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                }
            ]
        }
    ]
  },
  {
    no: 7,
    label: "Tỉ lệ Scan tự động",
    value: null, 
    unit: null,
    children: [
        {
            label: "Nhà mạng Viettel",
            value: null,
            unit: null,
            children: [
                {
                    label: "Số lần sử dụng tính năng Scan tự động",
                    value: "Giá trị",
                    unit: null
                },
                {
                    label: "Số lần sacn tự động có kết quả",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                }
            ]
        },
        {
            label: "Nhà mạng Vinaphone",
            value: null,
            unit: null,
            children: [
                {
                    label: "Số lần sử dụng tính năng scan tự động",
                    value: "Giá trị",
                    unit: null
                },
                {
                    label: "Số lần sacn tự động có kết quả",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                }
            ]
        },
        {
            label: "Nhà mạng Mobiphone",
            value: null,
            unit: null,
            children: [
                {
                    label: "Số lần sử dụng tính năng scan tự động",
                    value: "Giá trị",
                    unit: null
                },
                {
                    label: "Số lần sacn tự động có kết quả",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                }
            ]
        },
        {
            label: "Nhà mạng Vietnammobile",
            value: null,
            unit: null,
            children: [
                {
                    label: "Số lần sử dụng tính năng scan tự động",
                    value: "Giá trị",
                    unit: null
                },
                {
                    label: "Số lần sacn tự động có kết quả",
                    value: "Giá trị",
                    unit: "Tỉ lệ"
                }
            ]
        }
    ]
  },
  {
    no: 8,
    label: 'Tỉ lệ lấy IMEI',
    value: null,
    unit: null,
    children: [
        {
            label: 'Nhà mạng Viettel',
            value: null,
            unit: null,
            children: [
                {
                    label: 'Tổng số IMSI thu thập',
                    value: 'Giá trị',
                    unit: null
                },
                {
                    label: 'Tổng số IMSI lấy được IMEI',
                    value: 'Giá trị',
                    unit: 'Tỉ lệ'
                }
            ]
        },
        {
            label: 'Nhà mạng Vinaphone',
            value: null,
            unit: null,
            children: [
                {
                    label: 'Tổng số IMSI thu thập',
                    value: 'Giá trị',
                    unit: null
                },
                {
                    label: 'Tổng số IMSI lấy được IMEI',
                    value: 'Giá trị',
                    unit: 'Tỉ lệ'
                }
            ]
        },
        {
            label: 'Nhà mạng Mobiphone',
            value: null,
            unit: null,
            children: [
                {
                    label: 'Tổng số IMSI thu thập',
                    value: 'Giá trị',
                    unit: null
                },
                {
                    label: 'Tổng số IMSI lấy được IMEI',
                    value: 'Giá trị',
                    unit: 'Tỉ lệ'
                }
            ]
        },
        {
            label: 'Nhà mạng Vietnameobile',
            value: null,
            unit: null,
            children: [
                {
                    label: 'Tổng số IMSI thu thập',
                    value: 'Giá trị',
                    unit: null
                },
                {
                    label: 'Tổng số IMSI lấy được IMEI',
                    value: 'Giá trị',
                    unit: 'Tỉ lệ'
                }
            ]
        }
    ]
  },
  {
    no: 9,
    label: 'Tỉ lệ lấy IMSI',
    value: null,
    unit: null,
    children: [
        {
            label: 'Nhà mạng Viettel',
            value: null,
            unit: null,
            children: [
                {
                    label: 'Số thủ tục Identity request ',
                    value: 'Giá trị',
                    unit: null
                },
                {
                    label: 'Số phản hồi Identity response thành công',
                    value: 'Giá trị',
                    unit: 'Tỉ lệ'
                }
            ]
        },
        {
            label: 'Nhà mạng Vinaphone',
            value: null,
            unit: null,
            children: [
                {
                    label: 'Số thủ tục Identity request ',
                    value: 'Giá trị',
                    unit: null
                },
                {
                    label: 'Số phản hồi Identity response thành công',
                    value: 'Giá trị',
                    unit: 'Tỉ lệ'
                }
            ]
        },
        {
            label: 'Nhà mạng Mobiphone',
            value: null,
            unit: null,
            children: [
                {
                    label: 'Số thủ tục Identity request ',
                    value: 'Giá trị',
                    unit: null
                },
                {
                    label: 'Số phản hồi Identity response thành công',
                    value: 'Giá trị',
                    unit: 'Tỉ lệ'
                }
            ]
        },
        {
            label: 'Nhà mạng Vietnammobile',
            value: null,
            unit: null,
            children: [
                {
                    label: 'Số thủ tục Identity request ',
                    value: 'Giá trị',
                    unit: null
                },
                {
                    label: 'Số phản hồi Identity response thành công',
                    value: 'Giá trị',
                    unit: 'Tỉ lệ'
                }
            ]
        }
    ]
  },
  {
    no: 10,
    label: 'Số IMSI lấy được tối đa trong 1s',
    value: null, 
    unit: null,
    children: [
        {
            label: 'Nhà mạng Viettel',
            value: 'Giá trị',
            unit: null
        },
        {
            label: 'Nhà mạng Vinaphone',
            value: 'Giá trị',
            unit: null
        },
        {
            label: 'Nhà mạng Mobilephone',
            value: 'Giá trị',
            unit: null
        },
        {
            label: 'Nhà mạng Vietnamemobile',
            value: 'Giá trị',
            unit: null
        }
    ]
  }
];

export const systemKpi: Metric[] = [
    {
        no: 1,
        label: 'Khoảng thời gian hoàn thành thủ tục PRACH trung bình',
        value: 'Giá trị',
        unit: null
    },
    {
        no: 2,
        label: 'Thời gian hoàn thành thủ tục PRACH cao nhất',
        value: 'Giá trị',
        unit: null
    },
    {
        no: 3,
        label: 'Thời gian hoàn thành thủ tục Identity trung bình',
        value: 'Giá trị',
        unit: null
    },
    {
        no: 4,
        label: 'Thời gian hoàn thành thủ tục Identity cao nhất',
        value: 'Giá trị',
        unit: null
    },
    {
        no: 5,
        label: 'Tỷ lệ nhận được bản tin rrcConectionRequest',
        value: null,
        unit: null,
        children: [
          {
            label: 'Số lần nhận được bản tin RACH phía enb',
            value: 'Giá trị',
            unit: null
          },
          {
            label: 'Số lần nhận được bản tin rrcConectionRequest',
            value: 'Giá trị',
            unit: 'Tỉ lệ'
          }
        ]
    },
    {
        no: 6,
        label: 'Tỷ lệ nhận được bản tin rrcConectionComplete recv',
        value: null,
        unit: null,
        children: [
            {
                label: 'Số lần nhận được bản tin rrcConectionComplete recv phía enb',
                value: 'Giá trị',
                unit: null
            }
        ]
    },
]
