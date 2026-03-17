import { computed, onMounted, ref } from 'vue';
import { fetchSettings } from '../../api/system';
const settings = ref({});
const loading = ref(false);
const entries = computed(() => Object.entries(settings.value));
onMounted(async () => {
    loading.value = true;
    try {
        settings.value = await fetchSettings();
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
if (__VLS_ctx.entries.length) {
    const __VLS_12 = {}.ElDescriptions;
    /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        column: (1),
        border: true,
    }));
    const __VLS_14 = __VLS_13({
        column: (1),
        border: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    for (const [[key, value]] of __VLS_getVForSourceType((__VLS_ctx.entries))) {
        const __VLS_16 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
            key: (key),
            label: (key),
        }));
        const __VLS_18 = __VLS_17({
            key: (key),
            label: (key),
        }, ...__VLS_functionalComponentArgsRest(__VLS_17));
        __VLS_19.slots.default;
        (value);
        var __VLS_19;
    }
    var __VLS_15;
}
else {
    const __VLS_20 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        description: "暂无设置项",
    }));
    const __VLS_22 = __VLS_21({
        description: "暂无设置项",
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
}
var __VLS_7;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['page-view']} */ ;
/** @type {__VLS_StyleScopedClasses['page-view__header']} */ ;
/** @type {__VLS_StyleScopedClasses['page-block']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            loading: loading,
            entries: entries,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
