import { computed, reactive, ref, watch } from 'vue';
defineOptions({ name: 'ProductForm' });
const props = defineProps();
const emit = defineEmits();
const formRef = ref();
const form = reactive({
    name: '',
    sku: '',
    categoryId: '',
    price: 0,
    costPrice: 0,
    stock: 0,
    status: 'draft',
    cover: 'https://images.example.com/default.png',
    description: ''
});
const rules = {
    name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
    sku: [{ required: true, message: '请输入 SKU', trigger: 'blur' }],
    categoryId: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
    price: [{ required: true, message: '请输入售价', trigger: 'blur' }],
    costPrice: [{ required: true, message: '请输入成本价', trigger: 'blur' }],
    stock: [{ required: true, message: '请输入库存', trigger: 'blur' }]
};
function resetForm(value) {
    Object.assign(form, value ?? {
        name: '',
        sku: '',
        categoryId: props.categories[0]?.id ?? '',
        price: 0,
        costPrice: 0,
        stock: 0,
        status: 'draft',
        cover: 'https://images.example.com/default.png',
        description: ''
    });
}
watch(() => props.initialValue, (value) => resetForm(value), { immediate: true });
watch(() => props.categories, () => {
    if (!form.categoryId && props.categories.length) {
        form.categoryId = props.categories[0].id;
    }
}, { immediate: true });
const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});
async function submit() {
    const valid = await formRef.value?.validate().catch(() => false);
    if (!valid) {
        return;
    }
    emit('submit', {
        ...form,
        price: Number(form.price),
        costPrice: Number(form.costPrice),
        stock: Number(form.stock)
    });
}
function handleClose() {
    visible.value = false;
}
const __VLS_exposed = {
    form,
    submit
};
defineExpose(__VLS_exposed);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.visible),
    title: (__VLS_ctx.initialValue ? '编辑商品' : '新增商品'),
    width: "720px",
    teleported: (false),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.visible),
    title: (__VLS_ctx.initialValue ? '编辑商品' : '新增商品'),
    width: "720px",
    teleported: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClosed: (__VLS_ctx.handleClose)
};
var __VLS_8 = {};
__VLS_3.slots.default;
const __VLS_9 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
}));
const __VLS_11 = __VLS_10({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_13 = {};
__VLS_12.slots.default;
const __VLS_15 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
    gutter: (16),
}));
const __VLS_17 = __VLS_16({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_18.slots.default;
const __VLS_19 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
    span: (12),
}));
const __VLS_21 = __VLS_20({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
__VLS_22.slots.default;
const __VLS_23 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    label: "商品名称",
    prop: "name",
}));
const __VLS_25 = __VLS_24({
    label: "商品名称",
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
__VLS_26.slots.default;
const __VLS_27 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
    modelValue: (__VLS_ctx.form.name),
    name: "name",
    placeholder: "请输入商品名称",
}));
const __VLS_29 = __VLS_28({
    modelValue: (__VLS_ctx.form.name),
    name: "name",
    placeholder: "请输入商品名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
var __VLS_26;
var __VLS_22;
const __VLS_31 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
    span: (12),
}));
const __VLS_33 = __VLS_32({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
__VLS_34.slots.default;
const __VLS_35 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
    label: "SKU",
    prop: "sku",
}));
const __VLS_37 = __VLS_36({
    label: "SKU",
    prop: "sku",
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
__VLS_38.slots.default;
const __VLS_39 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    modelValue: (__VLS_ctx.form.sku),
    name: "sku",
    placeholder: "请输入 SKU",
}));
const __VLS_41 = __VLS_40({
    modelValue: (__VLS_ctx.form.sku),
    name: "sku",
    placeholder: "请输入 SKU",
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
var __VLS_38;
var __VLS_34;
const __VLS_43 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
    span: (12),
}));
const __VLS_45 = __VLS_44({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
__VLS_46.slots.default;
const __VLS_47 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
    label: "商品分类",
    prop: "categoryId",
}));
const __VLS_49 = __VLS_48({
    label: "商品分类",
    prop: "categoryId",
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
__VLS_50.slots.default;
const __VLS_51 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
    modelValue: (__VLS_ctx.form.categoryId),
    placeholder: "请选择分类",
    ...{ style: {} },
}));
const __VLS_53 = __VLS_52({
    modelValue: (__VLS_ctx.form.categoryId),
    placeholder: "请选择分类",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
__VLS_54.slots.default;
for (const [category] of __VLS_getVForSourceType((__VLS_ctx.categories))) {
    const __VLS_55 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
        key: (category.id),
        label: (category.name),
        value: (category.id),
    }));
    const __VLS_57 = __VLS_56({
        key: (category.id),
        label: (category.name),
        value: (category.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_56));
}
var __VLS_54;
var __VLS_50;
var __VLS_46;
const __VLS_59 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
    span: (12),
}));
const __VLS_61 = __VLS_60({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
__VLS_62.slots.default;
const __VLS_63 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
    label: "商品状态",
    prop: "status",
}));
const __VLS_65 = __VLS_64({
    label: "商品状态",
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
__VLS_66.slots.default;
const __VLS_67 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
    modelValue: (__VLS_ctx.form.status),
    placeholder: "请选择状态",
    ...{ style: {} },
}));
const __VLS_69 = __VLS_68({
    modelValue: (__VLS_ctx.form.status),
    placeholder: "请选择状态",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
__VLS_70.slots.default;
const __VLS_71 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
    label: "草稿",
    value: "draft",
}));
const __VLS_73 = __VLS_72({
    label: "草稿",
    value: "draft",
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
const __VLS_75 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
    label: "上架",
    value: "active",
}));
const __VLS_77 = __VLS_76({
    label: "上架",
    value: "active",
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
const __VLS_79 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({
    label: "下架",
    value: "inactive",
}));
const __VLS_81 = __VLS_80({
    label: "下架",
    value: "inactive",
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
var __VLS_70;
var __VLS_66;
var __VLS_62;
const __VLS_83 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
    span: (8),
}));
const __VLS_85 = __VLS_84({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
__VLS_86.slots.default;
const __VLS_87 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({
    label: "售价",
    prop: "price",
}));
const __VLS_89 = __VLS_88({
    label: "售价",
    prop: "price",
}, ...__VLS_functionalComponentArgsRest(__VLS_88));
__VLS_90.slots.default;
const __VLS_91 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
    modelValue: (__VLS_ctx.form.price),
    name: "price",
    type: "number",
}));
const __VLS_93 = __VLS_92({
    modelValue: (__VLS_ctx.form.price),
    name: "price",
    type: "number",
}, ...__VLS_functionalComponentArgsRest(__VLS_92));
var __VLS_90;
var __VLS_86;
const __VLS_95 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_96 = __VLS_asFunctionalComponent(__VLS_95, new __VLS_95({
    span: (8),
}));
const __VLS_97 = __VLS_96({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_96));
__VLS_98.slots.default;
const __VLS_99 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
    label: "成本价",
    prop: "costPrice",
}));
const __VLS_101 = __VLS_100({
    label: "成本价",
    prop: "costPrice",
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
__VLS_102.slots.default;
const __VLS_103 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
    modelValue: (__VLS_ctx.form.costPrice),
    name: "costPrice",
    type: "number",
}));
const __VLS_105 = __VLS_104({
    modelValue: (__VLS_ctx.form.costPrice),
    name: "costPrice",
    type: "number",
}, ...__VLS_functionalComponentArgsRest(__VLS_104));
var __VLS_102;
var __VLS_98;
const __VLS_107 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107({
    span: (8),
}));
const __VLS_109 = __VLS_108({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_108));
__VLS_110.slots.default;
const __VLS_111 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_112 = __VLS_asFunctionalComponent(__VLS_111, new __VLS_111({
    label: "库存",
    prop: "stock",
}));
const __VLS_113 = __VLS_112({
    label: "库存",
    prop: "stock",
}, ...__VLS_functionalComponentArgsRest(__VLS_112));
__VLS_114.slots.default;
const __VLS_115 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_116 = __VLS_asFunctionalComponent(__VLS_115, new __VLS_115({
    modelValue: (__VLS_ctx.form.stock),
    name: "stock",
    type: "number",
}));
const __VLS_117 = __VLS_116({
    modelValue: (__VLS_ctx.form.stock),
    name: "stock",
    type: "number",
}, ...__VLS_functionalComponentArgsRest(__VLS_116));
var __VLS_114;
var __VLS_110;
const __VLS_119 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_120 = __VLS_asFunctionalComponent(__VLS_119, new __VLS_119({
    span: (24),
}));
const __VLS_121 = __VLS_120({
    span: (24),
}, ...__VLS_functionalComponentArgsRest(__VLS_120));
__VLS_122.slots.default;
const __VLS_123 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({
    label: "封面地址",
    prop: "cover",
}));
const __VLS_125 = __VLS_124({
    label: "封面地址",
    prop: "cover",
}, ...__VLS_functionalComponentArgsRest(__VLS_124));
__VLS_126.slots.default;
const __VLS_127 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_128 = __VLS_asFunctionalComponent(__VLS_127, new __VLS_127({
    modelValue: (__VLS_ctx.form.cover),
    name: "cover",
    placeholder: "请输入封面图地址",
}));
const __VLS_129 = __VLS_128({
    modelValue: (__VLS_ctx.form.cover),
    name: "cover",
    placeholder: "请输入封面图地址",
}, ...__VLS_functionalComponentArgsRest(__VLS_128));
var __VLS_126;
var __VLS_122;
const __VLS_131 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_132 = __VLS_asFunctionalComponent(__VLS_131, new __VLS_131({
    span: (24),
}));
const __VLS_133 = __VLS_132({
    span: (24),
}, ...__VLS_functionalComponentArgsRest(__VLS_132));
__VLS_134.slots.default;
const __VLS_135 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_136 = __VLS_asFunctionalComponent(__VLS_135, new __VLS_135({
    label: "商品描述",
    prop: "description",
}));
const __VLS_137 = __VLS_136({
    label: "商品描述",
    prop: "description",
}, ...__VLS_functionalComponentArgsRest(__VLS_136));
__VLS_138.slots.default;
const __VLS_139 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_140 = __VLS_asFunctionalComponent(__VLS_139, new __VLS_139({
    modelValue: (__VLS_ctx.form.description),
    name: "description",
    type: "textarea",
    rows: (4),
    placeholder: "请输入商品描述",
}));
const __VLS_141 = __VLS_140({
    modelValue: (__VLS_ctx.form.description),
    name: "description",
    type: "textarea",
    rows: (4),
    placeholder: "请输入商品描述",
}, ...__VLS_functionalComponentArgsRest(__VLS_140));
var __VLS_138;
var __VLS_134;
var __VLS_18;
var __VLS_12;
{
    const { footer: __VLS_thisSlot } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "page-actions page-actions--end" },
    });
    const __VLS_143 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_144 = __VLS_asFunctionalComponent(__VLS_143, new __VLS_143({
        ...{ 'onClick': {} },
    }));
    const __VLS_145 = __VLS_144({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_144));
    let __VLS_147;
    let __VLS_148;
    let __VLS_149;
    const __VLS_150 = {
        onClick: (...[$event]) => {
            __VLS_ctx.visible = false;
        }
    };
    __VLS_146.slots.default;
    var __VLS_146;
    const __VLS_151 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_152 = __VLS_asFunctionalComponent(__VLS_151, new __VLS_151({
        ...{ 'onClick': {} },
        dataTestid: "submit-product",
        type: "primary",
    }));
    const __VLS_153 = __VLS_152({
        ...{ 'onClick': {} },
        dataTestid: "submit-product",
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_152));
    let __VLS_155;
    let __VLS_156;
    let __VLS_157;
    const __VLS_158 = {
        onClick: (__VLS_ctx.submit)
    };
    __VLS_154.slots.default;
    var __VLS_154;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['page-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['page-actions--end']} */ ;
// @ts-ignore
var __VLS_14 = __VLS_13;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            formRef: formRef,
            form: form,
            rules: rules,
            visible: visible,
            submit: submit,
            handleClose: handleClose,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {
            ...__VLS_exposed,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
