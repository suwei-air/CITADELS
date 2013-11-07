/*
Characters::

Assassin
Thief
Magician
King
Bishop
Merchant
Architect
Warlord
*/
exports.Roles = [
  { 'name': 'Assassin',	'order': 1 },
  { 'name': 'Thief',	'order': 2 },
  { 'name': 'Magician',	'order': 3 },
  { 'name': 'King',	'order': 4 },
  { 'name': 'Bishop',	'order': 5 },
  { 'name': 'Merchant',	'order': 6 },
  { 'name': 'Architect',	'order': 7 },
  { 'name': 'Warlord',	'order': 8 }
];

exports.CARDS = [
  {
    'name': '神庙',
    'number': 3,
    'cost': 1
  },
  {
    'name': '了望塔',
    'number': 3,
    'cost': 1
  },
  {
    'name': '庄园',
    'number': 5,
    'cost': 3
  },
  {
    'name': '酒馆',
    'number': 5,
    'cost': 1
  },
  {
    'name': '教堂',
    'number': 3,
    'cost': 2
  },
  {
    'name': '监狱',
    'number': 3,
    'cost': 2
  },
  {
    'name': '城堡',
    'number': 4,
    'cost': 4
  },
  {
    'name': '商栈',
    'number': 3,
    'cost': 2
  },
  {
    'name': '修道院',
    'number': 3,
    'cost': 3
  },
  {
    'name': '战场',
    'number': 3,
    'cost': 3
  },
  {
    'name': '宫殿',
    'number': 3,
    'cost': 5
  },
  {
    'name': '集市',
    'number': 4,
    'cost': 2
  },
  {
    'name': '大教堂',
    'number': 2,
    'cost': 5
  },
  {
    'name': '要塞',
    'number': 2,
    'cost': 5
  },
  {
    'name': '船坞',
    'number': 3,
    'cost': 3
  },
  {
    'name': '港口',
    'number': 3,
    'cost': 4
  },
  {
    'name': '市政厅',
    'number': 2,
    'cost': 5
  },
  {
    'name': '图书馆', // 如果你选择在回合开始时抽牌，你可以保留抽到的两张地区卡。
    'number': 1,
    'cost': 6
  },
  {
    'name': '巨龙门', // 这是一个名誉的象征 - 国家已经有超过一千年没有见过龙了。虽然建筑费用是6 枚金币，不过游戏完结时则当8 分计算。
    'number': 1,
    'cost': 6,
    'value': 8
  },
  {
    'name': '墓地', // 当领主破坏一个地区时，你可以支付一枚金币将被破坏的地区拿到手上。不过如果你本身是领主，则不能使用这项特殊能力。
    'number': 1,
    'cost': 5
  },
  {
    'name': '鬼城', // 当计算分数时，鬼城可以被视为任何颜色的建筑物。不过，如果你在游戏最后一个回合才建成鬼城，则不能使用这项特殊能力。
    'number': 1,
    'cost': 2
  },
  {
    'name': '魔法学院', // 当计算金币收入时，魔法学院可以被视为任何颜色的建筑物。换句话说，如果你是皇帝、主教、商人或领主时，金币收入就会加一。
    'number': 1,
    'cost': 6
  },
  {
    'name': '实验室', // 在你的回合当中，你可以从手上弃掉一张地区卡，然后换取一枚金币。这项特殊能力每个回合只能使用一次。
    'number': 1,
    'cost': 5
  },
  {
    'name': '铁匠铺', // 在你的回合当中，你可以支付2 枚金币，然后抽3 张地区卡。这项特殊能力每个回合只能使用一次。
    'number': 1,
    'cost': 5
  },
  {
    'name': '天文台', // 如果你选择在回合开始时抽牌，你可以抽3 张地区卡，保留一张，然后将其余两张放在牌迭最底。
    'number': 1,
    'cost': 5
  },
  {
    'name': '大学', // 这是一个名誉的象征 - 从来没有人知道它的作用。虽然建筑费用是6 枚金币，不过游戏完结时则当8 分计算。
    'number': 1,
    'cost': 6,
    'value': 8
  },
  {
    'name': '堡垒', // 堡垒不能被领主破坏。
    'number': 1,
    'cost': 3
  },
  {
    'name': '长城', // 领主要破坏你其它的地区要多付一枚金币。
    'number': 1,
    'cost': 6,
  }
];