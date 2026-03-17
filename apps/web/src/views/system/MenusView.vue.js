import { onMounted, ref } from 'vue';
import { fetchMenus } from '../../api/system';
const menus = ref([]);
const loading = ref(false);
function renderLabel(data) {
    return `${data.title} · ${data.path}`;
}
onMounted(async () => {
    loading.value = true;
    try {
        menus.value = await fetchMenus();
    }
    finally {
        loading.value = false;
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page-view" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page-view__header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    shadow: "never",
    ...{ class: "page-block" },
}));
const __VLS_2 = __VLS_1({
    shadow: "never",
    ...{ class: "page-block" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElSkeleton;
/** @type {[typeof __VLS_components.ElSkeleton, typeof __VLS_components.elSkeleton, typeof __VLS_components.ElSkeleton, typeof __VLS_components.elSkeleton, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    loading: (__VLS_ctx.loading),
    animated: true,
}));
const __VLS_6 = __VLS_5({
    loading: (__VLS_ctx.loading),
    animated: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
{
    const { template: __VLS_thisSlot } = __VLS_7.slots;
    const __VLS_8 = {}.ElSkeletonItem;
    /** @type {[typeof __VLS_components.ElSkeletonItem, typeof __VLS_components.elSkeletonItem, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        variant: "p",
        ...{ style: {} },
    }));
    const __VLS_10 = __VLS_9({
        variant: "p",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
}
if (!__VLS_ctx.menus.length) {
    const __VLS_12 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        description: "暂无菜单数据",
    }));
    const __VLS_14 = __VLS_13({
        description: "暂无菜单数据",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
}
else {
    const __VLS_16 = {}.ElTree;
    /** @type {[typeof __VLS_components.ElTree, typeof __VLS_components.elTree, typeof __VLS_components.ElTree, typeof __VLS_components.elTree, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        data: (__VLS_ctx.menus),
        nodeKey: "id",
        defaultExpandAll: true,
        expandOnClickNode: (false),
    }));
    const __VLS_18 = __VLS_17({
        data: (__VLS_ctx.menus),
        nodeKey: "id",
        defaultExpandAll: true,
        expandOnClickNode: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    __VLS_19.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_19.slots;
        const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "tree-node" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "tree-node__title" },
        });
        (__VLS_ctx.renderLabel(data));
        const __VLS_20 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
            size: "small",
            effect: "plain",
        }));
        const __VLS_22 = __VLS_21({
            size: "small",
            effect: "plain",
        }, ...__VLS_functionalComponentArgsRest(__VLS_21));
        __VLS_23.slots.default;
        (data.type);
        var __VLS_23;
    }
    var __VLS_19;
}
var __VLS_7;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['page-view']} */ ;
/** @type {__VLS_StyleScopedClasses['page-view__header']} */ ;
/** @type {__VLS_StyleScopedClasses['page-block']} */ ;
/** @type {__VLS_StyleScopedClasses['tree-node']} */ ;
/** @type {__VLS_StyleScopedClasses['tree-node__title']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            menus: menus,
            loading: loading,
            renderLabel: renderLabel,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
