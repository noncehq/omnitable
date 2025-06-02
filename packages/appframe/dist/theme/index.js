const common = {
    line_height: 1.62,
    color_main_rgb: '0,0,0',
    color_main: 'rgb(var(--color_main_rgb))',
    color_warning: '#FF8F00',
    color_warning_rgb: '255,143,0',
    color_success: '#00C853',
    color_success_rgb: '0,200,83',
    color_danger: '#FF1744',
    color_danger_rgb: '255,23,68',
    color_blue: '#075cdd',
    color_blue_rgb: '7,92,221',
    color_blue_active: '#3d87f5',
    color_blue_active_rgb: '61,135,245',
    color_bg_blur: 'rgba(var(--color_bg_rgb), 0.48)'
};
const light = {
    color_std: 'white',
    color_std_rgb: '255,255,255',
    color_contrast: 'black',
    color_contrast_rgb: '0,0,0',
    color_text: '#000000',
    color_text_rgb: '0,0,0',
    color_text_sub: 'rgba(0,0,0,0.9)',
    color_text_sublight: 'rgba(0,0,0,0.81)',
    color_text_grey: 'rgba(0,0,0,0.72)',
    color_text_greylight: 'rgba(0,0,0,0.6)',
    color_text_light: 'rgba(0,0,0,0.48)',
    color_text_softlight: 'rgba(0,0,0,0.36)',
    color_bg: '#ffffff',
    color_bg_rgb: '255,255,255',
    color_bg_1: '#fafafa',
    color_bg_1_rgb: '250,250,250',
    color_bg_2: '#f0f0f0',
    color_bg_2_rgb: '240,240,240',
    color_border: 'rgba(0, 0, 0, 0.09)',
    color_border_light: 'rgba(0, 0, 0, 0.06)',
    color_border_soft: 'rgba(0, 0, 0, 0.036)',
    color_border_softlight: 'rgba(0, 0, 0, 0.021)',
    shadow: '0 0 30px rgba(var(--color_text_rgb), 0.072)',
    wave: 'rgba(var(--color_main_rgb), 0.06)'
};
const dark = {
    color_std: 'black',
    color_std_rgb: '0,0,0',
    color_contrast: 'white',
    color_contrast_rgb: '255,255,255',
    color_text: '#d2d2d2',
    color_text_rgb: '210,210,210',
    color_text_sub: 'rgba(210,210,210,0.9)',
    color_text_sublight: 'rgba(210,210,210,0.81)',
    color_text_grey: 'rgba(210,210,210,0.72)',
    color_text_greylight: 'rgba(210,210,210,0.6)',
    color_text_light: 'rgba(210,210,210,0.48)',
    color_text_softlight: 'rgba(210,210,210,0.36)',
    color_bg: '#060606',
    color_bg_rgb: '6,6,6',
    color_bg_1: '#121212',
    color_bg_1_rgb: '12,12,12',
    color_bg_2: '#212121',
    color_bg_2_rgb: '21,21,21',
    color_border: 'rgba(255, 255, 255, 0.09)',
    color_border_light: 'rgba(255, 255, 255, 0.06)',
    color_border_soft: 'rgba(255, 255, 255, 0.036)',
    color_border_softlight: 'rgba(255, 255, 255, 0.021)',
    shadow: '0 0 42px rgba(var(--color_contrast_rgb), 0.03)',
    wave: 'rgba(var(--color_text_rgb), 0.3)'
};
const antd = {
    token: {
        colorSuccess: common.color_success,
        colorWarning: common.color_warning,
        colorError: common.color_danger,
        controlHeightLG: 38,
        controlHeight: 30,
        controlHeightSM: 26,
        controlHeightXS: 18,
        fontFamily: 'inherit',
        controlOutline: 'none'
    }
};
const getAntdTheme = (theme)=>{
    const vars = 'light' === theme ? light : dark;
    const is_dark = 'dark' === theme;
    return {
        hashed: false,
        token: {
            ...antd.token,
            ...is_dark ? {
                boxShadowSecondary: vars.shadow
            } : {},
            colorPrimary: `rgb(${vars.color_contrast_rgb})`,
            colorWhite: `rgb(${vars.color_std_rgb})`,
            colorText: vars.color_text,
            colorTextBase: vars.color_text,
            colorBgBase: vars.color_bg,
            colorBgContainer: vars.color_bg,
            colorBgElevated: is_dark ? vars.color_bg_1 : vars.color_bg,
            colorBgLayout: vars.color_bg_1,
            colorBorder: vars.color_border,
            colorBorderSecondary: vars.color_border_light,
            colorBgContainerDisabled: vars.color_border_soft,
            controlItemBgActive: vars.color_bg_2,
            switchHeight: 34,
            boxShadow: vars.shadow,
            borderRadiusXS: 3,
            borderRadiusSM: 6,
            borderRadius: 6
        },
        components: {
            Button: {
                primaryColor: vars.color_bg
            },
            Checkbox: {
                borderRadiusXS: 3,
                borderRadiusSM: 3,
                borderRadius: 3
            },
            Switch: {
                colorPrimary: vars.color_text,
                controlHeight: 24,
                controlHeightSM: 22,
                controlHeightXS: 20
            },
            DatePicker: {
                colorPrimary: vars.color_text,
                controlHeight: 24,
                cellHeight: 24,
                cellWidth: 24,
                timeCellHeight: 24,
                timeColumnWidth: 36,
                textHeight: 30,
                fontSize: 12,
                colorSplit: 'transparent'
            },
            Dropdown: {
                controlItemBgHover: vars.color_bg_2
            },
            Input: {
                colorPrimary: vars.color_text,
                colorPrimaryHover: vars.color_text_grey
            },
            Segmented: {
                borderRadiusSM: 6,
                borderRadiusXS: 4,
                controlHeightSM: 24,
                colorBgLayout: vars.color_bg_1
            },
            Slider: {
                handleSize: 8,
                handleSizeHover: 10
            },
            Radio: {
                colorPrimary: vars.color_text,
                dotSize: 9,
                radioSize: 12
            },
            Tabs: {
                colorPrimary: vars.color_text
            },
            Pagination: {
                controlHeight: 24
            },
            Menu: {
                itemHeight: 32,
                itemMarginBlock: 0,
                itemMarginInline: 0,
                itemPaddingInline: 0,
                itemBorderRadius: 6,
                iconSize: 16,
                subMenuItemBg: 'unset',
                itemSelectedColor: vars.color_text
            }
        }
    };
};
export { common, dark, getAntdTheme, light };

//# sourceMappingURL=index.js.map