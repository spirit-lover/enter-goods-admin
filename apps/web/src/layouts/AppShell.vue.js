import { computed } from 'vue';
import { useRoute } from 'vue-router';
defineOptions({ name: 'AppShell' });
const props = defineProps();
const __VLS_emit = defineEmits();
const route = useRoute();
const activePath = computed(() => route.path);
function resolveMenuPath(menu) {
    if (menu.children?.length) {
        return resolveMenuPath(menu.children[0]);
    }
    return menu.path;
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.ElContainer;
/** @type {[typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "app-shell" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "app-shell" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.ElAside;
/** @type {[typeof __VLS_components.ElAside, typeof __VLS_components.elAside, typeof __VLS_components.ElAside, typeof __VLS_components.elAside, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    ...{ class: "app-shell__aside" },
    width: "240px",
}));
const __VLS_7 = __VLS_6({
    ...{ class: "app-shell__aside" },
    width: "240px",
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "app-shell__brand" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "app-shell__brand-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "app-shell__brand-subtitle" },
});
const __VLS_9 = {}.ElScrollbar;
/** @type {[typeof __VLS_components.ElScrollbar, typeof __VLS_components.elScrollbar, typeof __VLS_components.ElScrollbar, typeof __VLS_components.elScrollbar, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({}));
const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
const __VLS_13 = {}.ElMenu;
/** @type {[typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    defaultActive: (__VLS_ctx.activePath),
    ...{ class: "app-shell__menu" },
    backgroundColor: "transparent",
    textColor: "#c9d4e4",
    activeTextColor: "#ffffff",
    router: true,
}));
const __VLS_15 = __VLS_14({
    defaultActive: (__VLS_ctx.activePath),
    ...{ class: "app-shell__menu" },
    backgroundColor: "transparent",
    textColor: "#c9d4e4",
    activeTextColor: "#ffffff",
    router: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
for (const [group] of __VLS_getVForSourceType((props.menus))) {
    (group.id);
    if (group.children?.length) {
        const __VLS_17 = {}.ElSubMenu;
        /** @type {[typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, ]} */ ;
        // @ts-ignore
        const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
            index: (group.id),
        }));
        const __VLS_19 = __VLS_18({
            index: (group.id),
        }, ...__VLS_functionalComponentArgsRest(__VLS_18));
        __VLS_20.slots.default;
        {
            const { title: __VLS_thisSlot } = __VLS_20.slots;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (group.title);
        }
        for (const [item] of __VLS_getVForSourceType((group.children))) {
            const __VLS_21 = {}.ElMenuItem;
            /** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
            // @ts-ignore
            const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
                key: (item.id),
                index: (__VLS_ctx.resolveMenuPath(item)),
            }));
            const __VLS_23 = __VLS_22({
                key: (item.id),
                index: (__VLS_ctx.resolveMenuPath(item)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_22));
            __VLS_24.slots.default;
            (item.title);
            var __VLS_24;
        }
        var __VLS_20;
    }
    else {
        const __VLS_25 = {}.ElMenuItem;
        /** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
        // @ts-ignore
        const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
            index: (__VLS_ctx.resolveMenuPath(group)),
        }));
        const __VLS_27 = __VLS_26({
            index: (__VLS_ctx.resolveMenuPath(group)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_26));
        __VLS_28.slots.default;
        (group.title);
        var __VLS_28;
    }
}
var __VLS_16;
var __VLS_12;
var __VLS_8;
const __VLS_29 = {}.ElContainer;
/** @type {[typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({}));
const __VLS_31 = __VLS_30({}, ...__VLS_functionalComponentArgsRest(__VLS_30));
__VLS_32.slots.default;
const __VLS_33 = {}.ElHeader;
/** @type {[typeof __VLS_components.ElHeader, typeof __VLS_components.elHeader, typeof __VLS_components.ElHeader, typeof __VLS_components.elHeader, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
    ...{ class: "app-shell__header" },
}));
const __VLS_35 = __VLS_34({
    ...{ class: "app-shell__header" },
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
__VLS_36.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "app-shell__headline" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "app-shell__subline" },
});
const __VLS_37 = {}.ElDropdown;
/** @type {[typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
    trigger: "click",
}));
const __VLS_39 = __VLS_38({
    trigger: "click",
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
__VLS_40.slots.default;
const __VLS_41 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
    type: "primary",
    plain: true,
}));
const __VLS_43 = __VLS_42({
    type: "primary",
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
__VLS_44.slots.default;
(props.username);
var __VLS_44;
{
    const { dropdown: __VLS_thisSlot } = __VLS_40.slots;
    const __VLS_45 = {}.ElDropdownMenu;
    /** @type {[typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, ]} */ ;
    // @ts-ignore
    const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({}));
    const __VLS_47 = __VLS_46({}, ...__VLS_functionalComponentArgsRest(__VLS_46));
    __VLS_48.slots.default;
    const __VLS_49 = {}.ElDropdownItem;
    /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
        ...{ 'onClick': {} },
    }));
    const __VLS_51 = __VLS_50({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    let __VLS_53;
    let __VLS_54;
    let __VLS_55;
    const __VLS_56 = {
        onClick: (...[$event]) => {
            __VLS_ctx.$emit('logout');
        }
    };
    __VLS_52.slots.default;
    var __VLS_52;
    var __VLS_48;
}
var __VLS_40;
var __VLS_36;
const __VLS_57 = {}.ElMain;
/** @type {[typeof __VLS_components.ElMain, typeof __VLS_components.elMain, typeof __VLS_components.ElMain, typeof __VLS_components.elMain, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
    ...{ class: "app-shell__main" },
}));
const __VLS_59 = __VLS_58({
    ...{ class: "app-shell__main" },
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
__VLS_60.slots.default;
var __VLS_61 = {};
var __VLS_60;
var __VLS_32;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['app-shell']} */ ;
/** @type {__VLS_StyleScopedClasses['app-shell__aside']} */ ;
/** @type {__VLS_StyleScopedClasses['app-shell__brand']} */ ;
/** @type {__VLS_StyleScopedClasses['app-shell__brand-title']} */ ;
/** @type {__VLS_StyleScopedClasses['app-shell__brand-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['app-shell__menu']} */ ;
/** @type {__VLS_StyleScopedClasses['app-shell__header']} */ ;
/** @type {__VLS_StyleScopedClasses['app-shell__headline']} */ ;
/** @type {__VLS_StyleScopedClasses['app-shell__subline']} */ ;
/** @type {__VLS_StyleScopedClasses['app-shell__main']} */ ;
// @ts-ignore
var __VLS_62 = __VLS_61;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            activePath: activePath,
            resolveMenuPath: resolveMenuPath,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
