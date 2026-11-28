export const content = {
  en: {
    language: 'English',
    purchase: {
      add: 'Add to inquiry', list: 'Inquiry list', remove: 'Remove', empty: 'Your inquiry list is empty.',
      quantity: 'Quantity', files: 'Photos or purchase list',
      fileHint: 'JPG, PNG, WebP, Excel or CSV. Up to 3 files, 5 MB each and 10 MB total.',
      invalidFiles: 'Check the file type, count and size.', storageError: 'We could not save this inquiry. Please retry or email the files.',
      received: 'Inquiry reference: ', pending: 'Your inquiry was saved. Keep this reference for follow-up.',
      all: 'All', category: 'Category', weight: 'Excavator weight class', travel: 'Travel',
      travelLabels: { tracked: 'Tracked', wheeled: 'Wheeled', 'walk-behind': 'Walk-behind' },
      noResults: 'No categories match these filters. Choose All to clear a filter.',
      details: 'Selection guide', related: 'Related categories'
    },
    skip: 'Skip to content',
    brandLine: 'Compact machines, attachments and spare parts',
    nav: {
      home: 'Home',
      equipment: 'Machines',
      attachments: 'Attachments',
      parts: 'Parts',
      manufacturing: 'Manufacturing',
      delivery: 'Delivery',
      contact: 'Contact'
    },
    request: 'Get a quote',
    factoryLink: 'Explore manufacturing partners',
    photoCredit: 'On-site photo at a manufacturing partner’s workshop in China',
    home: {
      title: 'Mini excavators, attachments and spare parts from China',
      headline: 'Compact machines, attachments and spare parts from China',
      search: 'Search the catalog',
      searchAction: 'Search',
      commonSearches: 'Common searches',
      searchTerms: ['Mini excavator 1–2t', 'Breaker', 'Filters', 'Quick coupler'],
      placeholder: 'Try mini excavator, quick coupler or hydraulic pump',
      empty: 'No matching category. Send the model or part number for a fit check.',
      inquire: 'Ask about this item',
      caption: 'Mini excavator · equipment illustration',
      intro: 'Share your machine model, attachment interface or spare part number. We check fit and availability with suppliers in China, including attachments for small, medium and large machines.',
      sourcing: 'Browse the sourcing catalog',
      manufacturingTitle: 'Inside our manufacturing partners’ workshops',
      manufacturingText: 'See workshop floors and production equipment. For an individual order, ask us to confirm which processes and inspection records apply.',
      audienceTitle: 'How do you buy?'
    },
    capabilities: {
      title: 'Manufacturing capabilities',
      intro: 'Our manufacturing partners in China support metal fabrication, precision machining and molding for machinery components.',
      action: 'Discuss your manufacturing requirements',
      items: {
        structures: {
          title: 'Steel structural components',
          description: 'Structural parts and welded assemblies for construction equipment, with laser cutting, CNC bending and machining options. Share your drawing and inspection requirements for review.',
          alt: 'Fabricated steel structures staged on the workshop floor'
        },
        gears: {
          title: 'Precision gear components',
          description: 'Custom gears and transmission components. Hobbing, gear grinding and heat treatment options can be reviewed against your tooth profile, material and accuracy requirements.',
          alt: 'Machined cylindrical gear components'
        },
        tanks: {
          title: 'Industrial hydraulic reservoirs',
          description: 'Welded metal reservoirs for industrial machines and hydraulic power units, including laser-welded designs. We review capacity, port layout, internal cleanliness and leak-test requirements with you.',
          alt: 'Welded metal hydraulic reservoir being loaded for transport'
        },
        composites: {
          title: 'Engineering plastics & composites',
          description: 'Molded engine hoods, exterior panels, canopies and hollow housings. Process options include PDCPD reaction injection molding, SMC compression molding, LFT-D, rotational molding, RTM, vacuum infusion and FRP hand lay-up.',
          alt: 'Molded yellow machinery panels staged on workshop stands'
        }
      }
    },
    equipment: {
      title: 'Mini & compact machines',
      description: 'Explore mini excavators, skid steers, compact loaders and rollers. Share the site access, operating weight and configuration you need.',
      checklistTitle: 'What to include',
      checklist: [
        ['Machine or application', 'Tell us the equipment type, target model or the job it needs to do.'],
        ['Configuration and quantity', 'Include any capacity, attachment or operating requirements and how many units you need.'],
        ['Destination and timing', 'Share the delivery country or port and the date you need the equipment.']
      ],
      action: 'Send equipment requirements'
    },
    attachments: {
      title: 'Attachments by application',
      description: 'Source buckets, breakers, augers and quick couplers for small, medium and large machines. We check the interface for your specific carrier.',
      action: 'Request an attachment fit check',
      checklistTitle: 'How we check the fit',
      checklist: [
        ['Carrier and task', 'Share the machine make, model, operating weight and the work you need to do.'],
        ['Mounting interface', 'Include the pin diameters, pin centers and bracket width, or email a photo of the mount.'],
        ['Hydraulic requirements', 'For powered tools, include available flow and pressure. We review these with the supplier before quoting.']
      ]
    },
    parts: {
      title: 'Machinery spare parts',
      description: 'Share a part number or machine model so we can review fit and availability.',
      checklistTitle: 'What helps us check fit',
      checklist: [
        ['Part number or machine model', 'Include the machine serial number or production year if available.'],
        ['Dimensions or a photo', 'Note the critical dimensions or mention any nameplate, old-part photos or drawings you have.'],
        ['Quantity and destination', 'Tell us how many you need and where the parts will be delivered.']
      ],
      action: 'Ask about a part'
    },
    audiences: [
      { type: 'dealer', detail: 'Share product categories, expected volumes and the market you supply.', action: 'Dealer & bulk inquiries' },
      { type: 'parts', detail: 'Send a part number, machine model or the details on a nameplate.', action: 'Find replacement parts' },
      { type: 'project', detail: 'Tell us the application, configuration and delivery schedule for your project.', action: 'Project equipment inquiries' }
    ],
    manufacturing: {
      title: 'Manufacturing partners in China',
      description: 'A look at the workshops and production equipment behind our sourcing network.',
      equipmentTitle: 'Production equipment',
      workshopTitle: 'Workshop environment',
      tourTitle: 'Workshop walkthrough',
      tourNote: 'On-site footage from a partner workshop in China.',
      play: 'Load workshop video',
      videoLabel: 'Workshop walkthrough, without audio',
      videoFallback: 'Open the workshop video',
      qualityTitle: 'Confirm inspection requirements for your order',
      qualityText: 'Include the model or part number and any dimensions, tolerances or documents your team needs to review. We’ll confirm what can be supplied for that item.'
    },
    delivery: {
      title: 'Services, delivery & support',
      description: 'See how we check fit, confirm your quote, inspect the goods and prepare shipment for machines, attachments and spare parts.',
      processTitle: 'From inquiry to shipment',
      steps: [
        ['Inquiry & selection', 'Send the model or part number, quantity, destination and target delivery window. If the model is unknown, share the job or photos of the machine, mount or part.'],
        ['Fit & specification check', 'We check machine configuration, attachment dimensions and hydraulic requirements where applicable, or match the part number and serial number. We flag any measurements or details still needed.'],
        ['Written quotation', 'Review the confirmed model or configuration, quantity, price, packing, estimated lead time, trade term and named port or place. The quote lists payment terms and validity.'],
        ['Order confirmation & payment', 'Check the agreed scope against the order confirmation or contract, then follow the payment schedule and milestones stated there.'],
        ['Preparation & pre-shipment inspection', 'Confirm the scope before shipment. Depending on the goods, checks may cover model, quantity, condition, critical dimensions, operation or packing. Agree on which photos or records you need.'],
        ['Loading & shipping documents', 'Confirm packing, shipping marks and the planned dispatch. We coordinate the documents agreed for the shipment and share the latest schedule.']
      ],
      shippingTitle: 'Shipping options',
      shipping: [
        ['Full container (FCL)', 'Consider a dedicated container for machines or larger mixed orders of attachments and parts. We review package dimensions, weights and how the cargo can be secured.'],
        ['Shared container (LCL)', 'An option for smaller batches of parts or attachments. We check the packed volume, handling and protection before recommending it.'],
        ['Special cargo', 'For oversized or heavy cargo, we review packed dimensions and weight with the forwarder to confirm the equipment, route and handling.']
      ],
      shippingNote: 'The quotation states the trade term, named port or place, freight basis and estimated schedule. Sailing and arrival dates depend on booking and transit.',
      termsTitle: 'Payment, documents & after-sales',
      terms: [
        ['Payment terms', 'Payment method, currency, deposit if applicable and balance milestones are agreed per order and recorded in writing.'],
        ['Shipping documents', 'Confirm the commercial invoice, packing list and bill of lading or other transport document as applicable. Tell us early if you need a certificate of origin, manual or other documents so we can check availability.'],
        ['Warranty & support', 'The quotation or contract states any warranty, its start date and scope, how wear parts are handled and how to request support. For an existing order, include the order reference and the model, serial number or part number.']
      ],
      inspectionTitle: 'Inspection before dispatch',
      inspectionDescription: 'Tell us what you need to verify before release, such as a model or part marking, mounting dimensions, a functional check or packing photos. We’ll confirm the checks and records available for those goods.'
    },
    contact: {
      title: 'Tell us what you’re sourcing',
      description: 'A list of models, a part number or a brief description of the job is enough to start.',
      formTitle: 'Send an inquiry',
      note: 'Share your requirements with our team. You can also save a draft to finish later.',
      draftNote: 'Your draft is ready to review.',
      select: 'Choose an inquiry type',
      labels: {
        name: 'Name',
        email: 'Email',
        phoneNumber: 'Phone or WhatsApp (optional)',
        country: 'Destination country or region',
        type: 'Inquiry type',
        requirements: 'Requirements'
      },
      types: { equipment: 'Equipment sourcing', attachments: 'Attachment fit check', parts: 'Parts & fit check', dealer: 'Dealer & bulk inquiry', project: 'Project equipment inquiry' },
      hints: {
        default: 'Include the machine, attachment or part you need and the expected quantity.',
        attachments: 'Include the carrier model, operating weight, mounting interface and intended task.',
        equipment: 'Include the target machine, application or configuration, quantity and delivery window.',
        parts: 'Include the part number or machine model, quantity and any dimensions you know.',
        dealer: 'Include the product categories, expected volumes and the market you supply.',
        project: 'Include the application, equipment requirements, delivery location and project schedule.'
      },
      prepare: 'Prepare draft',
      submit: 'Send inquiry',
      consent: 'I agree to the use of my submitted information to respond to this inquiry.',
      budget: 'Combined inquiry length:',
      messages: {
        sending: 'Sending your inquiry…',
        success: 'Your inquiry has been submitted.',
        tooLong: 'Please shorten your requirements. The full inquiry includes your destination and inquiry type.',
        invalid: 'Check the form fields and your email address before sending.',
        unavailable: 'Online inquiries are temporarily unavailable. Your input has been kept.',
        failed: 'Your inquiry could not be sent. Your input has been kept. Please try again later.',
        unconfirmed: 'We could not confirm receipt. Your input has been kept. Please check before sending again.'
      },
      download: 'Download draft',
      emailAction: 'Open in email',
      briefLabel: 'Inquiry draft',
      noScript: 'Enable JavaScript to send an inquiry or prepare a draft.',
      emailContact: 'Contact by email',
      whatsapp: 'Chat on WhatsApp'
    },
    ctaTitle: 'Have a model, part number or purchase list?',
    ctaText: 'Share what you need and where it’s going so we can review your request.',
    notFound: 'Page not found'
  },
  'zh-CN': {
    language: '简体中文',
    purchase: {
      add: '加入询价单', list: '询价单', remove: '移除', empty: '询价单目前为空。',
      quantity: '数量', files: '照片或采购清单',
      fileHint: '支持 JPG、PNG、WebP、Excel 或 CSV。最多 3 个文件，单个不超过 5 MB，合计不超过 10 MB。',
      invalidFiles: '请检查文件格式、数量和大小。', storageError: '询盘暂未保存，请重试或通过邮件发送文件。',
      received: '询盘编号：', pending: '询盘已保存，请保留编号以便跟进。',
      all: '全部', category: '品类', weight: '挖掘机吨位', travel: '行走方式',
      travelLabels: { tracked: '履带式', wheeled: '轮式', 'walk-behind': '手扶式' },
      noResults: '没有符合条件的品类。可选择「全部」清除对应筛选。',
      details: '选型说明', related: '相关品类'
    },
    skip: '跳到正文',
    brandLine: '小微工程机械、属具与配件采购',
    nav: {
      home: '首页',
      equipment: '小微整机',
      attachments: '属具',
      parts: '配件采购',
      manufacturing: '合作工厂',
      delivery: '交付与支持',
      contact: '联系'
    },
    request: '获取报价',
    factoryLink: '了解合作工厂',
    photoCredit: '中国合作工厂车间实拍',
    home: {
      title: '小微工程机械、大中小型主机属具与配件采购',
      headline: '小微工程机械、属具与配件采购',
      search: '搜索采购目录',
      searchAction: '搜索',
      commonSearches: '常用搜索',
      searchTerms: ['1–2 t 微型挖掘机', '破碎锤', '滤芯', '快换接头'],
      placeholder: '试试微型挖掘机、快换接头或液压泵',
      empty: '目录暂无匹配类别，可提交机型或件号，由我们核对。',
      inquire: '询问此产品',
      caption: '微型挖掘机 · 机型示意图',
      intro: '提供整机型号、属具接口或配件件号，我们会与中国工厂和供应商核对适配和供货情况。属具询价覆盖大、中、小型主机。',
      sourcing: '浏览采购目录',
      manufacturingTitle: '走进合作工厂',
      manufacturingText: '查看现场车间和生产设备。您可以按订单要求核对适用的生产工序及检验资料。',
      audienceTitle: '按采购场景进入'
    },
    capabilities: {
      title: '生产加工能力',
      intro: '依托国内制造合作伙伴，提供工程机械零部件的金属加工、精密机加工与新材料成型配套。',
      action: '沟通您的加工需求',
      items: {
        structures: {
          title: '工程机械结构件',
          description: '加工工程机械钢制结构件及焊接总成，工艺涵盖激光切割、数控折弯和机加工。可按图纸核对材料、尺寸及验收要求。',
          alt: '车间内待周转的钢制结构件'
        },
        gears: {
          title: '精密齿轮件',
          description: '配套定制齿轮、齿轮柱等传动件。可按齿形、材料和精度要求评审滚齿、磨齿及热处理方案。',
          alt: '加工后的圆柱齿轮件'
        },
        tanks: {
          title: '工业机械液压油箱',
          description: '为工业机械和液压泵站配套焊接金属油箱，含激光焊接方案。按项目核对容量、接口布置、内壁清洁及密封检验要求。',
          alt: '正在装车的焊接金属液压油箱'
        },
        composites: {
          title: '新材料加工',
          description: '面向发动机罩、外覆盖件、顶棚和中空壳体等应用。工艺包括 PDCPD 反应注射、SMC 模压、LFT-D 长纤热塑在线模压、滚塑、RTM 树脂传递模塑、真空导入及玻璃钢手糊。',
          alt: '车间支架上的黄色成型覆盖件'
        }
      }
    },
    equipment: {
      title: '小微工程机械',
      description: '按作业空间和工作重量选微型挖掘机、滑移装载机、小型装载机或压路机，再与供应商核对具体配置。',
      checklistTitle: '建议提供的信息',
      checklist: [
        ['机型或应用场景', '提供设备类别、目标机型，或说明设备需要完成什么作业。'],
        ['配置与数量', '说明吨位、容量、属具或作业条件等要求，以及计划采购的数量。'],
        ['目的地与时间', '提供目的地国家或港口，以及预计需要设备的日期。']
      ],
      action: '提交整机需求'
    },
    attachments: {
      title: '工程机械属具',
      description: '为大、中、小型主机选配挖斗、破碎锤、螺旋钻和快换接头。按作业用途选型，再核对主机接口。',
      action: '咨询属具适配',
      checklistTitle: '如何核对适配',
      checklist: [
        ['主机与工况', '提供品牌、机型、工作重量以及要完成的作业。'],
        ['安装接口', '提供销轴直径、中心距和耳间距，也可通过邮件发送接口照片。'],
        ['液压参数', '液压属具需核对主机流量和压力，我们会与供应商确认后报价。']
      ]
    },
    parts: {
      title: '工程机械配件',
      description: '提供零件号或设备型号，我们会据此核对适配和供货情况。',
      checklistTitle: '核对适配需要的信息',
      checklist: [
        ['零件号或整机型号', '如有设备序列号或生产年份，也可一并提供。'],
        ['尺寸或照片', '说明关键尺寸，或注明您有铭牌、旧件照片或图纸。'],
        ['数量与目的地', '告诉我们预计采购数量及配件交付地点。']
      ],
      action: '提交配件需求'
    },
    audiences: [
      { type: 'dealer', detail: '提供采购品类、预计数量和销售市场。', action: '经销与批量采购' },
      { type: 'parts', detail: '提供件号、设备型号或铭牌信息。', action: '维修配件匹配' },
      { type: 'project', detail: '说明项目工况、设备配置和交付时间。', action: '工程项目采购' }
    ],
    manufacturing: {
      title: '中国制造合作工厂',
      description: '查看我们在国内合作的生产车间与设备。',
      equipmentTitle: '生产设备',
      workshopTitle: '厂房环境',
      tourTitle: '车间巡览',
      tourNote: '视频在国内合作工厂实地拍摄。',
      play: '加载车间视频',
      videoLabel: '车间巡览，无音轨',
      videoFallback: '打开车间视频',
      qualityTitle: '按订单确认检验要求',
      qualityText: '如需查阅检验资料，请提供型号或零件号，并说明希望核对的尺寸、公差或文件，我们会确认该产品可提供的资料。'
    },
    delivery: {
      title: '交付与支持',
      description: '了解整机、属具和配件从选型、适配核对、报价到验货出运的流程，以及各阶段要确认的事项。',
      processTitle: '从询盘到出运',
      steps: [
        ['询盘与初步选型', '提供机型或件号、数量、目的地和计划交付时间。型号不明时，可说明工况，或附上整机、安装接口或旧件照片。'],
        ['核对适配与规格', '核对整机配置、属具安装尺寸和适用的液压参数，或按件号与序列号核配备件。需要补测尺寸或补充资料时，我们会逐项说明。'],
        ['书面报价', '核对型号或配置、数量、价格、包装、预计交期、贸易术语及指定港口或地点。报价单注明付款条件与有效期。'],
        ['确认订单与付款', '核对订单确认书或合同中的供货范围，按其中约定的付款方式、时间和节点执行。'],
        ['备货与出运前检验', '出运前确认验货范围。按货物类型核对型号、数量、外观、关键尺寸、功能或包装，并约定需要提交的照片或记录。'],
        ['装运与交付单证', '确认包装、唛头及预计出运安排。按订单约定协调所需单证，并同步最新运输计划。']
      ],
      shippingTitle: '运输方式',
      shipping: [
        ['整柜（FCL）', '适合整机或批量混装属具和配件。根据包装尺寸、重量和货物固定要求核对柜型及装载方案。'],
        ['拼箱（LCL）', '可用于较小批次的配件或属具。报价前核对包装体积、装卸要求和防护方式。'],
        ['特殊货物运输', '超尺寸或超重货物先提供包装后的尺寸和重量，由我们与货代核对运输设备、路线和装卸要求。']
      ],
      shippingNote: '报价注明贸易术语、指定港口或地点、运费口径及预计运输计划。船期和到港时间以实际订舱及运输进度为准。',
      termsTitle: '付款、单证与售后',
      terms: [
        ['付款条件', '按订单书面确认付款方式、币种、适用的预付款及尾款节点。'],
        ['出运单证', '按订单核对商业发票、装箱单、提单或其他运输单据。需要原产地证、操作手册或其他文件时，请在报价前提出，以便确认能否提供。'],
        ['质保与售后', '报价或合同注明适用的质保、起算时间、覆盖范围、易损件条款及售后申请方式。已有订单请提供订单号及机型、序列号或件号。']
      ],
      inspectionTitle: '出运前验货',
      inspectionDescription: '如需核对铭牌或件号、安装尺寸、功能测试或装箱照片，请在询盘时注明。我们会按该批货物确认可安排的检查和可提供的记录。'
    },
    contact: {
      title: '告诉我们您的采购需求',
      description: '一份机型清单、一个零件号或一段工况描述，都可以作为沟通起点。',
      formTitle: '发送询盘',
      note: '填写采购需求后可直接发送给我们，也可以先保存草稿。',
      draftNote: '询盘草稿已生成，请核对内容。',
      select: '请选择采购类型',
      labels: {
        name: '联系人',
        email: '邮箱',
        phoneNumber: '电话或 WhatsApp（选填）',
        country: '目的地国家或地区',
        type: '采购类型',
        requirements: '采购需求'
      },
      types: { equipment: '整机采购', attachments: '属具选型与适配', parts: '配件采购与适配', dealer: '经销与批量采购', project: '工程项目采购' },
      hints: {
        default: '说明需要的整机、属具或配件和预计数量。',
        attachments: '请提供主机型号、工作重量、接口形式及作业用途。',
        equipment: '说明目标机型、工况或配置、数量和计划交付时间。',
        parts: '提供零件号或整机型号、预计数量和已知尺寸。',
        dealer: '说明采购品类、预计采购量和销售市场。',
        project: '说明项目工况、设备要求、交付地点及时间。'
      },
      prepare: '生成草稿',
      submit: '发送询盘',
      consent: '我同意使用本次提交的信息回复我的询盘。',
      budget: '合并询盘长度：',
      messages: {
        sending: '正在发送询盘……',
        success: '您的询盘已提交。',
        tooLong: '请精简采购需求。合并留言包含目的地和采购类型。',
        invalid: '请检查表单填写内容，并确认邮箱地址无误。',
        unavailable: '在线询盘暂不可用，已保留填写内容。',
        failed: '询盘暂时无法送达，已保留填写内容。请稍后重试。',
        unconfirmed: '暂未确认收件结果，已保留填写内容。请先核实，再决定是否重发。'
      },
      download: '下载草稿',
      emailAction: '使用邮件发送',
      briefLabel: '询盘草稿',
      noScript: '启用 JavaScript 后可发送询盘或生成草稿。',
      emailContact: '通过邮件联系',
      whatsapp: '通过 WhatsApp 联系'
    },
    ctaTitle: '手上有机型、件号或采购清单？',
    ctaText: '请告诉我们您需要什么、计划发往哪里，以便核对供货选项。',
    notFound: '页面不存在'
  }
};
