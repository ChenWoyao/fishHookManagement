const GlobalModel = {
  namespace: 'global',
  state: {
    collapsed: false,
  },
  effects: {
  },
  reducers: {
    changeLayoutCollapsed(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return { ...state, collapsed: payload };
    },
  },
};
export default GlobalModel;
