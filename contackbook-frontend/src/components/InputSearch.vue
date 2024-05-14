<script>
export default {
  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },
  emits: ["submit", "update:modelValue"],
  methods: {
    updateModelValue(e) {
      this.$emit("update:modelValue", e.target.value);
    },
    submit() {
      const normalizedSearchText = this.modelValue.toLowerCase(); // Chuẩn hóa dữ liệu thành chữ thường
      this.$emit("submit", normalizedSearchText); // Gửi yêu cầu tìm kiếm với dữ liệu đã được chuẩn hóa
    },
  },
};
</script>
<template>
  <div class="input-group">
    <input
      type="text"
      class="form-control"
      placeholder="Nhập thông tin cần tìm"
      :value="modelValue"
      @input="updateModelValue"
      @keyup.enter="submit"
    />
    <div class="input-group-append">
      <button class="btn btn-outline-secondary" type="button" @click="submit">
        <i class="fas fa-search"></i>Tim Kiem
      </button>
    </div>
  </div>
</template>
