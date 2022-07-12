var mainModule = angular.module('MainModule', ['ui.select', 'ngSanitize', 'decision.tree']);

mainModule.controller('MainController', ['$decisionTree', function($decisionTree) {
  
  var vm = this;
  
  var RiskFactor = Object.freeze({ "HIGH": "HIGH", "MODERATE": "MODERATE", "LOW": "LOW"});

  var FEDTREE = { risk: RiskFactor.MODERATE, 
    description: 'We recommend <a target="_blank" href="https://github.com/Xtra-Computing/FedTree">FedTree</a> <br/> <img src="image/fedtree-logo.png" height = "80" >',
    explanation:'FedTree is designed for the federated training of decision trees. It supports tree-based models for both horizontal FL and vertical FL. It can be deployed for single-host simulation and multi-host option for realistic FL simulation. As for privacy protection, FedTree takes advantage of aggregators for better computation efficiency but does not reveal any model parameter. It uses SecureBoost in vertical FL and HistSecAgg in horizontal FL. It also supports secure aggregation that prevents the aggregator from learning individual model gradients. Besides, differential privacy is supported by FedTree to protect user privacy and defend against potential privacy attacks.'
  };
  var PADDLEFL = { risk: RiskFactor.MODERATE, 
    description: 'We recommend <a target="_blank" href="https://github.com/PaddlePaddle/PaddleFL">PaddleFL</a> <br/> <img src="image/paddlefl-logo.png" height = "80" >',
    explanation:'PaddleFL covers most FL-related techniques in both horizontal and vertical FL settings. It supports both regression and neural networks for both horizontal FL and vertical FL. It can be deployed for single-host simulation and multi-host option for realistic FL simulation. As for privacy protection, PaddleFL does not require a 3rd party aggregator for vertical FL. It also supports secure aggregation that prevents the aggregator from learning individual model gradients in horizontal settings. Besides, differential privacy is supported by PaddleFL to protect user privacy and defend against potential privacy attacks. PaddleFL uses its own ML backend PaddlePaddle.'
  };
  var TFF = { risk: RiskFactor.MODERATE, 
    description: 'We recommend <a target="_blank" href="https://github.com/tensorflow/federated">TFF</a> <br/> <img src="image/tff-logo.png" height = "80" >',
    explanation:'TFF aims to provide easy-to-use APIs for users to adopt and develop horizontal FL algorithms. It supports both regression and neural networks for horizontal FL. It can be deployed only for single-host simulation without a multi-host option, which is still under development. As for privacy protection, TFF supports secure aggregation that prevents the aggregator from learning individual model gradients. Besides, differential privacy is supported by TFF to protect user privacy and defend against potential privacy attacks. However, TFF launches the clients with less or no parallelism among clients’ training.'
  };
  var FLUTE = { risk: RiskFactor.MODERATE, 
    description: 'We recommend <a target="_blank" href="https://github.com/microsoft/msrflute">FLUTE</a> <br/> <img src="image/FLUTE-logo.png" height = "80" >',
    explanation:'FLUTE aims to provide easy-to-use APIs for users to adopt and develop horizontal FL algorithms. It supports both regression and neural networks for horizontal FL. It can be deployed for single-host simulation and multi-host option for realistic FL simulation. As for privacy protection, differential privacy is supported by FLUTE to protect user privacy and defend against potential privacy attacks. As for computation efficiency, FLUTE has a much lower training time than other frameworks thanks to its parallelism.'
  };
  var FLOWER = { risk: RiskFactor.MODERATE, 
    description: 'We recommend <a target="_blank" href="https://github.com/adap/flower">Flower</a> <br/> <img src="image/flower.webp" height = "80" >',
    explanation:'Flower aims to provide easy-to-use APIs for users to adopt and develop horizontal FL algorithms. It supports both regression and neural networks for horizontal FL. It can be deployed for single-host simulation and multi-host option for realistic FL simulation. As for privacy protection, differential privacy is supported by Flower to protect user privacy and defend against potential privacy attacks. As for computation efficiency, Flower has a much lower training time than other frameworks thanks to its parallelism, but has a high memory requirement as it keeps the states of all clients at all times regardless of client sampling.'
  };
  var FEDLEARNER = { risk: RiskFactor.MODERATE, 
    description: 'We recommend <a target="_blank" href="https://github.com/bytedance/fedlearner">Fedlearner</a> <br/> <img src="image/fedlearner-logo.png" height = "80" >',
    explanation:'Fedlearner covers most FL-related techniques in both horizontal and vertical FL settings. It supports both regression and neural networks for horizontal FL, and provides neural networks and tree-based models for vertical FL. It can be deployed for single-host simulation and multi-host option for realistic FL simulation. As for privacy protection, Fedlearner uses split learning which does not require a 3rd party aggregator for vertical FL but directly transmits the intermediate gradients from the follower to the leader.'
  };
  var FATE = { risk: RiskFactor.MODERATE, 
    description: 'We recommend <a target="_blank" href="https://github.com/FederatedAI/FATE">FATE</a> <br/> <img src="image/FATE_logo.png" height = "80" >',
    explanation:'FATE covers most FL-related techniques in both horizontal and vertical FL settings. It supports regression, neural networks, and tree-based models for both horizontal FL and vertical FL. It can be deployed for single-host simulation and multi-host option for realistic FL simulation. As for privacy protection, FATE uses HE-based solutions which do not require a 3rd party aggregator for vertical FL. It also supports secure aggregation that prevents the aggregator from learning individual model gradients.'
  };
  var FEDML = { risk: RiskFactor.MODERATE, 
    description: 'We recommend <a target="_blank" href="https://github.com/FedML-AI/FedML">FedML</a> <br/> <img src="image/fedml_logo.png" height = "80"  >',
    explanation:'FedML covers most FL-related techniques in both horizontal and vertical FL settings. It supports both regression and neural networks for both horizontal FL and vertical FL. It can be deployed for single-host simulation and multi-host option for realistic FL simulation. As for privacy protection, FedML supports secure aggregation that prevents the aggregator from learning individual model gradients.'
  };
  var CRYPTEN = { risk: RiskFactor.MODERATE, 
    description: 'We recommend <a target="_blank" href="https://github.com/facebookresearch/CrypTen">CrypTen</a> <br/> <img src="image/CrypTen-logo.png" height = "80" >',
    explanation:'CrypTen focuses on providing secure multi-party computation primitives. It supports both regression and neural networks for vertical FL. It can be deployed for single-host simulation and multi-host option for realistic FL simulation. As for privacy protection, CrypTen uses sMPC-based solutions which do not require a 3rd party aggregator for vertical FL. As for computation performance, CrypTen achieves better performance with sufficient training using 244 an efficient sMPC-based approach. Although the communication frequency of CrypTen is high, it is fast with low memory usage.'
  };
    
  var riskAssessmentTree =
    {
      question: "Is your scenario vertical or horizontal?",
      children: [
        {
          value: "Horizontal",
          question: "Do you need differential privacy (dp-sgd) in training?",
          children: [
            { 
              value: "Yes",
                question: "Which type of models do you need?",
                children: [
                  {
                    value: "Tree-based",
                    result: FEDTREE
                  },
                  {
                    value: "NN-based",
                      question: "Do you need to protect individual gradient with secure aggregation?",
                      children: [
                        {
                          value: "Yes",
                            question: "Do you need multi-host or cross-device deployment?",
                            children: [
                              {
                                value: "Yes",
                                result: PADDLEFL
                              },
                              {
                                value: "No",
                                  question: "Less training time or low memory consumption, which one is more important?",
                                  children: [
                                    {
                                      value: "Less training time",
                                      result: PADDLEFL
                                    },
                                    {
                                      value: "Low memory consumption",
                                      result: TFF
                                    }
                                  ]
                              },
                              {
                                value: "Not sure",
                                  question: "Less training time or low memory consumption, which one is more important?",
                                  children: [
                                    {
                                      value: "Less training time",
                                      result: PADDLEFL
                                    },
                                    {
                                      value: "Low memory consumption",
                                      result: TFF
                                    }
                                  ]
                              }
                            ]
                        },
                        {
                          value: "No",
                            question: "Are you only targetting local simulation with memory-efficient client sampling?",
                            children: [
                              {
                                value: "Yes",
                                result: TFF
                              },
                              {
                                value: "No",
                                  question: "Do you have very limited memory for simulation only?",
                                  children: [
                                    {
                                      value: "Yes",
                                      result: PADDLEFL
                                    },
                                    {
                                      value: "No",
                                        question: "Do you prefer model training with a memory-efficient client sampling or a realistic measurement with all clients online during the training?",
                                        children: [
                                          {
                                            value: "With client sampling",
                                            result: FLUTE
                                          },
                                          {
                                            value: "With all clients online",
                                            result: FLOWER
                                          }
                                        ]
                                    }
                                  ]
                              }
                            ]
                        },
                        {
                          value: "Not sure",
                            question: "Are you only targetting local simulation with memory-efficient client sampling?",
                            children: [
                              {
                                value: "Yes",
                                result: TFF
                              },
                              {
                                value: "No",
                                  question: "Do you have very limited memory for simulation only?",
                                  children: [
                                    {
                                      value: "Yes",
                                      result: PADDLEFL
                                    },
                                    {
                                      value: "No",
                                        question: "Do you prefer model training with a memory-efficient client sampling or a realistic measurement with all clients online during the training?",
                                        children: [
                                          {
                                            value: "With client sampling",
                                            result: FLUTE
                                          },
                                          {
                                            value: "With all clients online",
                                            result: FLOWER
                                          }
                                        ]
                                    }
                                  ]
                              }
                            ]
                        }
                      ]
                  }
                ]
            },
            { 
              value: "No", 
                question: "Which type of models do you need?",
                children: [
                  {
                    value: "Both",
                    result: FATE
                  },
                  {
                    value: "Tree-based",
                    result: FEDTREE
                  },
                  {
                    value: "NN-based",
                      question: "Do you have very limited memory for simulation only?",
                      children: [
                        {
                          value: "Yes",
                            question: "Do you perfer TensorFlow or PyTorch as the ML backend?",
                            children: [
                              {
                                value: "TensorFlow",
                                result: TFF
                              },
                              {
                                value: "PyTorch",
                                result: FEDML
                              }
                            ]
                        },
                        {
                          value: "No",
                            question: "Do you want to use split learning with 1-layer model for training?",
                            children: [
                              {
                                value: "Yes",
                                result: FEDLEARNER
                              },
                              {
                                value: "No",
                                  question: "Do you need to protect individual gradient with secure aggregation?",
                                  children: [
                                    {
                                      value: "Yes",
                                        question: "Do you need multi-host or cross-device deployment?",
                                        children: [
                                          {
                                            value: "Yes",
                                            result: PADDLEFL
                                          },
                                          {
                                            value: "No",
                                              question: "Less training time or low memory consumption, which one is more important?",
                                              children: [
                                                {
                                                  value: "Less training time",
                                                  result: PADDLEFL
                                                },
                                                {
                                                  value: "Low memory consumption",
                                                  result: TFF
                                                }
                                              ]
                                          },
                                          {
                                            value: "Not sure",
                                              question: "Less training time or low memory consumption, which one is more important?",
                                              children: [
                                                {
                                                  value: "Less training time",
                                                  result: PADDLEFL
                                                },
                                                {
                                                  value: "Low memory consumption",
                                                  result: TFF
                                                }
                                              ]
                                          }
                                        ]
                                    },
                                    {
                                      value: "No",
                                        question: "Are you only targetting local simulation with memory-efficient client sampling?",
                                        children: [
                                          {
                                            value: "Yes",
                                            result: TFF
                                          },
                                          {
                                            value: "No",
                                              question: "Do you have very limited memory for simulation only?",
                                              children: [
                                                {
                                                  value: "Yes",
                                                  result: PADDLEFL
                                                },
                                                {
                                                  value: "No",
                                                    question: "Do you prefer model training with a memory-efficient client sampling or a realistic measurement with all clients online during the training?",
                                                    children: [
                                                      {
                                                        value: "With client sampling",
                                                        result: FLUTE
                                                      },
                                                      {
                                                        value: "With all clients online",
                                                        result: FLOWER
                                                      }
                                                    ]
                                                }
                                              ]
                                          }
                                        ]
                                    },
                                    {
                                      value: "Not sure",
                                        question: "Are you only targetting local simulation with memory-efficient client sampling?",
                                        children: [
                                          {
                                            value: "Yes",
                                            result: TFF
                                          },
                                          {
                                            value: "No",
                                              question: "Do you have very limited memory for simulation only?",
                                              children: [
                                                {
                                                  value: "Yes",
                                                  result: PADDLEFL
                                                },
                                                {
                                                  value: "No",
                                                    question: "Do you prefer model training with a memory-efficient client sampling or a realistic measurement with all clients online during the training?",
                                                    children: [
                                                      {
                                                        value: "With client sampling",
                                                        result: FLUTE
                                                      },
                                                      {
                                                        value: "With all clients online",
                                                        result: FLOWER
                                                      }
                                                    ]
                                                }
                                              ]
                                          }
                                        ]
                                    }
                                  ]
                              },
                              {
                                value: "Not sure",
                                  question: "Do you need to protect individual gradient with secure aggregation?",
                                  children: [
                                    {
                                      value: "Yes",
                                        question: "Do you need multi-host or cross-device deployment?",
                                        children: [
                                          {
                                            value: "Yes",
                                            result: PADDLEFL
                                          },
                                          {
                                            value: "No",
                                              question: "Less training time or low memory consumption, which one is more important?",
                                              children: [
                                                {
                                                  value: "Less training time",
                                                  result: PADDLEFL
                                                },
                                                {
                                                  value: "Low memory consumption",
                                                  result: TFF
                                                }
                                              ]
                                          },
                                          {
                                            value: "Not sure",
                                              question: "Less training time or low memory consumption, which one is more important?",
                                              children: [
                                                {
                                                  value: "Less training time",
                                                  result: PADDLEFL
                                                },
                                                {
                                                  value: "Low memory consumption",
                                                  result: TFF
                                                }
                                              ]
                                          }
                                        ]
                                    },
                                    {
                                      value: "No",
                                        question: "Are you only targetting local simulation with memory-efficient client sampling?",
                                        children: [
                                          {
                                            value: "Yes",
                                            result: TFF
                                          },
                                          {
                                            value: "No",
                                              question: "Do you have very limited memory for simulation only?",
                                              children: [
                                                {
                                                  value: "Yes",
                                                  result: PADDLEFL
                                                },
                                                {
                                                  value: "No",
                                                    question: "Do you prefer model training with a memory-efficient client sampling or a realistic measurement with all clients online during the training?",
                                                    children: [
                                                      {
                                                        value: "With client sampling",
                                                        result: FLUTE
                                                      },
                                                      {
                                                        value: "With all clients online",
                                                        result: FLOWER
                                                      }
                                                    ]
                                                }
                                              ]
                                          }
                                        ]
                                    },
                                    {
                                      value: "Not sure",
                                        question: "Are you only targetting local simulation with memory-efficient client sampling?",
                                        children: [
                                          {
                                            value: "Yes",
                                            result: TFF
                                          },
                                          {
                                            value: "No",
                                              question: "Do you have very limited memory for simulation only?",
                                              children: [
                                                {
                                                  value: "Yes",
                                                  result: PADDLEFL
                                                },
                                                {
                                                  value: "No",
                                                    question: "Do you prefer model training with a memory-efficient client sampling or a realistic measurement with all clients online during the training?",
                                                    children: [
                                                      {
                                                        value: "With client sampling",
                                                        result: FLUTE
                                                      },
                                                      {
                                                        value: "With all clients online",
                                                        result: FLOWER
                                                      }
                                                    ]
                                                }
                                              ]
                                          }
                                        ]
                                    }
                                  ]
                              }
                            ]
                        }
                      ]
                  }
                ]
            },
            { 
              value: "Not sure", 
                question: "Which type of models do you need?",
                children: [
                  {
                    value: "Both",
                    result: FATE
                  },
                  {
                    value: "Tree-based",
                    result: FEDTREE
                  },
                  {
                    value: "NN-based",
                      question: "Do you have very limited memory for simulation only?",
                      children: [
                        {
                          value: "Yes",
                            question: "Do you perfer TensorFlow or PyTorch as the ML backend?",
                            children: [
                              {
                                value: "TensorFlow",
                                result: TFF
                              },
                              {
                                value: "PyTorch",
                                result: FEDML
                              }
                            ]
                        },
                        {
                          value: "No",
                            question: "Do you want to use split learning with 1-layer model for training?",
                            children: [
                              {
                                value: "Yes",
                                result: FEDLEARNER
                              },
                              {
                                value: "No",
                                  question: "Do you need to protect individual gradient with secure aggregation?",
                                  children: [
                                    {
                                      value: "Yes",
                                        question: "Do you need multi-host or cross-device deployment?",
                                        children: [
                                          {
                                            value: "Yes",
                                            result: PADDLEFL
                                          },
                                          {
                                            value: "No",
                                              question: "Less training time or low memory consumption, which one is more important?",
                                              children: [
                                                {
                                                  value: "Less training time",
                                                  result: PADDLEFL
                                                },
                                                {
                                                  value: "Low memory consumption",
                                                  result: TFF
                                                }
                                              ]
                                          },
                                          {
                                            value: "Not sure",
                                              question: "Less training time or low memory consumption, which one is more important?",
                                              children: [
                                                {
                                                  value: "Less training time",
                                                  result: PADDLEFL
                                                },
                                                {
                                                  value: "Low memory consumption",
                                                  result: TFF
                                                }
                                              ]
                                          }
                                        ]
                                    },
                                    {
                                      value: "No",
                                        question: "Are you only targetting local simulation with memory-efficient client sampling?",
                                        children: [
                                          {
                                            value: "Yes",
                                            result: TFF
                                          },
                                          {
                                            value: "No",
                                              question: "Do you have very limited memory for simulation only?",
                                              children: [
                                                {
                                                  value: "Yes",
                                                  result: PADDLEFL
                                                },
                                                {
                                                  value: "No",
                                                    question: "Do you prefer model training with a memory-efficient client sampling or a realistic measurement with all clients online during the training?",
                                                    children: [
                                                      {
                                                        value: "With client sampling",
                                                        result: FLUTE
                                                      },
                                                      {
                                                        value: "With all clients online",
                                                        result: FLOWER
                                                      }
                                                    ]
                                                }
                                              ]
                                          }
                                        ]
                                    },
                                    {
                                      value: "Not sure",
                                        question: "Are you only targetting local simulation with memory-efficient client sampling?",
                                        children: [
                                          {
                                            value: "Yes",
                                            result: TFF
                                          },
                                          {
                                            value: "No",
                                              question: "Do you have very limited memory for simulation only?",
                                              children: [
                                                {
                                                  value: "Yes",
                                                  result: PADDLEFL
                                                },
                                                {
                                                  value: "No",
                                                    question: "Do you prefer model training with a memory-efficient client sampling or a realistic measurement with all clients online during the training?",
                                                    children: [
                                                      {
                                                        value: "With client sampling",
                                                        result: FLUTE
                                                      },
                                                      {
                                                        value: "With all clients online",
                                                        result: FLOWER
                                                      }
                                                    ]
                                                }
                                              ]
                                          }
                                        ]
                                    }
                                  ]
                              },
                              {
                                value: "Not sure",
                                  question: "Do you need to protect individual gradient with secure aggregation?",
                                  children: [
                                    {
                                      value: "Yes",
                                        question: "Do you need multi-host or cross-device deployment?",
                                        children: [
                                          {
                                            value: "Yes",
                                            result: PADDLEFL
                                          },
                                          {
                                            value: "No",
                                              question: "Less training time or low memory consumption, which one is more important?",
                                              children: [
                                                {
                                                  value: "Less training time",
                                                  result: PADDLEFL
                                                },
                                                {
                                                  value: "Low memory consumption",
                                                  result: TFF
                                                }
                                              ]
                                          },
                                          {
                                            value: "Not sure",
                                              question: "Less training time or low memory consumption, which one is more important?",
                                              children: [
                                                {
                                                  value: "Less training time",
                                                  result: PADDLEFL
                                                },
                                                {
                                                  value: "Low memory consumption",
                                                  result: TFF
                                                }
                                              ]
                                          }
                                        ]
                                    },
                                    {
                                      value: "No",
                                        question: "Are you only targetting local simulation with memory-efficient client sampling?",
                                        children: [
                                          {
                                            value: "Yes",
                                            result: TFF
                                          },
                                          {
                                            value: "No",
                                              question: "Do you have very limited memory for simulation only?",
                                              children: [
                                                {
                                                  value: "Yes",
                                                  result: PADDLEFL
                                                },
                                                {
                                                  value: "No",
                                                    question: "Do you prefer model training with a memory-efficient client sampling or a realistic measurement with all clients online during the training?",
                                                    children: [
                                                      {
                                                        value: "With client sampling",
                                                        result: FLUTE
                                                      },
                                                      {
                                                        value: "With all clients online",
                                                        result: FLOWER
                                                      }
                                                    ]
                                                }
                                              ]
                                          }
                                        ]
                                    },
                                    {
                                      value: "Not sure",
                                        question: "Are you only targetting local simulation with memory-efficient client sampling?",
                                        children: [
                                          {
                                            value: "Yes",
                                            result: TFF
                                          },
                                          {
                                            value: "No",
                                              question: "Do you have very limited memory for simulation only?",
                                              children: [
                                                {
                                                  value: "Yes",
                                                  result: PADDLEFL
                                                },
                                                {
                                                  value: "No",
                                                    question: "Do you prefer model training with a memory-efficient client sampling or a realistic measurement with all clients online during the training?",
                                                    children: [
                                                      {
                                                        value: "With client sampling",
                                                        result: FLUTE
                                                      },
                                                      {
                                                        value: "With all clients online",
                                                        result: FLOWER
                                                      }
                                                    ]
                                                }
                                              ]
                                          }
                                        ]
                                    }
                                  ]
                              }
                            ]
                        }
                      ]
                  }
                ]
            }
          ]
        },
        {
          value: "Vertical",
            question: "Do you need differential privacy (dp-sgd) in training?",
            children: [
              {
                value: "Yes",
                  question: "Which type of models do you need?",
                  children: [
                    {
                      value: "Tree-based",
                      result: FEDTREE
                    },
                    {
                      value: "NN-based",
                      result: PADDLEFL
                    }
                  ]
              },
              {
                value: "No",
                  question: "Which type of models do you need?",
                  children: [
                    {
                      value: "Both",
                        question: "Is the threat model in split learning acceptable?",
                        children: [
                          {
                            value: "Yes",
                              question: "Less communication frequency or low memory consumption, which one is more important?",
                              children: [
                                {
                                  value: "Less communication",
                                  result: FATE
                                },
                                {
                                  value: "Low memory",
                                  result: FEDLEARNER
                                }
                              ]
                          },
                          {
                            value: "No",
                            result: FATE
                          }
                        ]
                    },
                    {
                      value: "Tree-based",
                        question: "Is less training time more important than low communication frequency and low memory usage?",
                        children: [
                          {
                            value: "Yes",
                            result: FEDTREE
                          },
                          {
                            value: "No",
                              question: "Is the threat model in split learning acceptable?",
                              children: [
                                {
                                  value: "Yes",
                                    question: "Less communication frequency or low memory consumption, which one is more important?",
                                    children: [
                                      {
                                        value: "Less communication",
                                        result: FATE
                                      },
                                      {
                                        value: "Low memory",
                                        result: FEDLEARNER
                                      }
                                    ]
                                },
                                {
                                  value: "No",
                                  result: FATE
                                }
                              ]
                          }
                        ]
                    },
                    {
                      value: "NN-based",
                        question: "Do you need to train large NN models?",
                        children: [
                          {
                            value: "Yes",
                            result: CRYPTEN
                          },
                          {
                            value: "No",
                              question: "Is large communication cost bearable?",
                              children: [
                                {
                                  value: "Yes",
                                    question: "Do you plan to use split learning?",
                                    children: [
                                      {
                                        value: "Yes",
                                        result: FEDLEARNER
                                      },
                                      {
                                        value: "No",
                                        result: FATE
                                      }
                                    ]
                                },
                                {
                                  value: "No",
                                    question: "Is the threat model in split learning acceptable?",
                                    children: [
                                      {
                                        value: "Yes",
                                          question: "Less communication frequency or low memory consumption, which one is more important?",
                                          children: [
                                            {
                                              value: "Less communication",
                                              result: FATE
                                            },
                                            {
                                              value: "Low memory",
                                              result: FEDLEARNER
                                            }
                                          ]
                                      },
                                      {
                                        value: "No",
                                        result: FATE
                                      }
                                    ]
                                }
                              ]
                          }
                        ]
                    }
                  ]
              },
              {
                value: "Not sure",
                  question: "Which type of models do you need?",
                  children: [
                    {
                      value: "Both",
                        question: "Is the threat model in split learning acceptable?",
                        children: [
                          {
                            value: "Yes",
                              question: "Less communication frequency or low memory consumption, which one is more important?",
                              children: [
                                {
                                  value: "Less communication",
                                  result: FATE
                                },
                                {
                                  value: "Low memory",
                                  result: FEDLEARNER
                                }
                              ]
                          },
                          {
                            value: "No",
                            result: FATE
                          }
                        ]
                    },
                    {
                      value: "Tree-based",
                        question: "Is less training time more important than low communication frequency and low memory usage?",
                        children: [
                          {
                            value: "Yes",
                            result: FEDTREE
                          },
                          {
                            value: "No",
                              question: "Is the threat model in split learning acceptable?",
                              children: [
                                {
                                  value: "Yes",
                                    question: "Less communication frequency or low memory consumption, which one is more important?",
                                    children: [
                                      {
                                        value: "Less communication",
                                        result: FATE
                                      },
                                      {
                                        value: "Low memory",
                                        result: FEDLEARNER
                                      }
                                    ]
                                },
                                {
                                  value: "No",
                                  result: FATE
                                }
                              ]
                          }
                        ]
                    },
                    {
                      value: "NN-based",
                        question: "Do you need to train large NN models?",
                        children: [
                          {
                            value: "Yes",
                            result: CRYPTEN
                          },
                          {
                            value: "No",
                              question: "Is large communication cost bearable?",
                              children: [
                                {
                                  value: "Yes",
                                    question: "Do you plan to use split learning?",
                                    children: [
                                      {
                                        value: "Yes",
                                        result: FEDLEARNER
                                      },
                                      {
                                        value: "No",
                                        result: FATE
                                      }
                                    ]
                                },
                                {
                                  value: "No",
                                    question: "Is the threat model in split learning acceptable?",
                                    children: [
                                      {
                                        value: "Yes",
                                          question: "Less communication frequency or low memory consumption, which one is more important?",
                                          children: [
                                            {
                                              value: "Less communication",
                                              result: FATE
                                            },
                                            {
                                              value: "Low memory",
                                              result: FEDLEARNER
                                            }
                                          ]
                                      },
                                      {
                                        value: "No",
                                        result: FATE
                                      }
                                    ]
                                }
                              ]
                          }
                        ]
                    }
                  ]
              }
            ]
        }
        
      ]
    };

	function tweak(tree, tweaker) {
	  tweaker(tree);
	  angular.forEach(tree.children, function (value) {
	    tweak(value, tweaker);
	    
	  });
	  
	  return tree;
	}

	vm.decisionTreeModes = [
		{ label: "ALL Buttons", tree: riskAssessmentTree },
		{ label: "ALL Selects", tree: tweak(
			angular.copy(riskAssessmentTree),
			function (child) {
				if (child.children) {
					child.selector = "drop-down";
				}
			}
		) },
		{ label: "Mixed (DDs when > 4 options)", tree: tweak(
			angular.copy(riskAssessmentTree),
			function (child) {
				if (child.children && child.children.length > 4) {
					child.selector = "drop-down";
				}
			}
		) }
	];
	vm.selectedDecisionTreeMode = vm.decisionTreeModes[0];

  vm.openDecisionTreeWizard = function () {
    
    $decisionTree.openWizard(
      {
        title: 'Understand your workload, find the most similar scenario in our list',
        resultTemplateUrl: 'risk-assessment-result.html',
        decisionTree: vm.selectedDecisionTreeMode.tree
      }  
    ).then(
      function (result) {
        vm.result = result;
      }
    );
  };

  vm.openDecisionTreeWizard();
}]);

mainModule.directive('decisionTreeResult', function () {
  return {
    restrict: 'E',
    scope: {
      result: '='
    },
    templateUrl: 'risk-assessment-result.html'
  }
});