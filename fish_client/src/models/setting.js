import defaultSettings from '../../config/defaultSettings';

const SettingModel = {
  namespace: 'settings',
  state: defaultSettings,
  reducers: {
    changeSetting(state = defaultSettings, { payload }) {
      const { contentWidth } = payload;
      // 自定义事件，element.dispatchEvent, element.addEventListener
      if (state.contentWidth !== contentWidth && window.dispatchEvent) {
        window.dispatchEvent(new Event('resize'));
      }

      return { ...state, ...payload };
    },
  },
};

export default SettingModel;
