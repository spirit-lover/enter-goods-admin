import { reactive, ref } from 'vue';
defineOptions({ name: 'LoginView' });
const emit = defineEmits();
const formRef = ref();
const loading = ref(false);
const errorMessages = ref([]);
const form = reactive({ username: '', password: '' });
const rules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ min: 8, message: '请输入至少 8 位密码', trigger: 'blur' }]
};
async function handleSubmit() {
    const nextErrors = [];
    if (!form.username.trim()) {
        nextErrors.push('请输入用户名');
    }
    if (form.password.trim().length < 8) {
        nextErrors.push('请输入至少 8 位密码');
    }
    errorMessages.value = nextErrors;
    if (nextErrors.length) {
        await formRef.value?.validate().catch(() => false);
        return;
    }
    loading.value = true;
    try {
        emit('submit', { ...form });
    }
    finally {
        loading.value = false;
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "login-panel" },
    shadow: "hover",
}));
const __VLS_2 = __VLS_1({
    ...{ class: "login-panel" },
    shadow: "hover",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "login-panel__header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    const __VLS_5 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
        type: "primary",
        effect: "light",
    }));
    const __VLS_7 = __VLS_6({
        type: "primary",
        effect: "light",
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    __VLS_8.slots.default;
    var __VLS_8;
}
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.errorMessages))) {
    const __VLS_9 = {}.ElAlert;
    /** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
        key: (item),
        ...{ class: "login-panel__alert" },
        type: "error",
        closable: (false),
        showIcon: true,
    }));
    const __VLS_11 = __VLS_10({
        key: (item),
        ...{ class: "login-panel__alert" },
        type: "error",
        closable: (false),
        showIcon: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
    __VLS_12.slots.default;
    {
        const { title: __VLS_thisSlot } = __VLS_12.slots;
        (item);
    }
    var __VLS_12;
}
const __VLS_13 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
    size: "large",
}));
const __VLS_15 = __VLS_14({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
    size: "large",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_17 = {};
__VLS_16.slots.default;
const __VLS_19 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
    label: "用户名",
    prop: "username",
}));
const __VLS_21 = __VLS_20({
    label: "用户名",
    prop: "username",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
__VLS_22.slots.default;
const __VLS_23 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    modelValue: (__VLS_ctx.form.username),
    name: "username",
    placeholder: "请输入用户名",
    clearable: true,
}));
const __VLS_25 = __VLS_24({
    modelValue: (__VLS_ctx.form.username),
    name: "username",
    placeholder: "请输入用户名",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
var __VLS_22;
const __VLS_27 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
    label: "密码",
    prop: "password",
}));
const __VLS_29 = __VLS_28({
    label: "密码",
    prop: "password",
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
__VLS_30.slots.default;
const __VLS_31 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
    modelValue: (__VLS_ctx.form.password),
    name: "password",
    type: "password",
    placeholder: "请输入密码",
    showPassword: true,
    clearable: true,
}));
const __VLS_33 = __VLS_32({
    modelValue: (__VLS_ctx.form.password),
    name: "password",
    type: "password",
    placeholder: "请输入密码",
    showPassword: true,
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
var __VLS_30;
const __VLS_35 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
    ...{ 'onClick': {} },
    dataTestid: "submit-login",
    ...{ class: "login-panel__submit" },
    type: "primary",
    loading: (__VLS_ctx.loading),
}));
const __VLS_37 = __VLS_36({
    ...{ 'onClick': {} },
    dataTestid: "submit-login",
    ...{ class: "login-panel__submit" },
    type: "primary",
    loading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
let __VLS_39;
let __VLS_40;
let __VLS_41;
const __VLS_42 = {
    onClick: (__VLS_ctx.handleSubmit)
};
__VLS_38.slots.default;
var __VLS_38;
var __VLS_16;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['login-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['login-panel__header']} */ ;
/** @type {__VLS_StyleScopedClasses['login-panel__alert']} */ ;
/** @type {__VLS_StyleScopedClasses['login-panel__submit']} */ ;
// @ts-ignore
var __VLS_18 = __VLS_17;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            formRef: formRef,
            loading: loading,
            errorMessages: errorMessages,
            form: form,
            rules: rules,
            handleSubmit: handleSubmit,
        };
    },
    __typeEmits: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
});
; /* PartiallyEnd: #4569/main.vue */
