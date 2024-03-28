<template>
  <div class="page row">
    <div class="col-md-10">
      <InputSearch v-model="searchText" />
      <!-- @submit="submitSearch"-->
    </div>
    <div class="mt-3 col-md-6">
      <h4>Danh bạ <i class="fas fa-address-book"></i></h4>

      <ContactList
        v-if="filteredContactsCount > 0"
        :contacts="filteredContacts"
        :activeIndex="activeIndex"
        @update:activeIndex="updateActiveIndex"
      >
      </ContactList>
      <!-- @update:activeIndex="updateActiveIndex"-->

      <p v-else>Không có liên hệ nào.</p>

      <div class="mt-3 row justify-content-around align-items-center">
        <button class="btn btn-sm btn-primary" @click="refreshList()">
          <i class="fas fa-redo"></i> Refresh
        </button>
        <button class="btn btn-sm btn-success" @click="goToAddContact()">
          <i class="fas fa-plus"></i> Add
        </button>
        <button class="btn btn-sm btn-danger" @click="removeAllContacts()">
          <i class="fas fa-trash"></i> Delete All
        </button>
      </div>
    </div>
    <div class="mt-3 col-md-6">
      <div v-if="activeContact">
        <h4>
          Contact details
          <i class="fas fa-address-card"></i>
        </h4>
        <ContactCard :contact="activeContact" />
        <router-link
          :to="{
            name: 'contact.edit',
            params: { id: activeContact._id },
          }"
        >
          <span class="mt-2 badge badge-warning">
            <i class="fas fa-edit"></i> Hiệu chỉnh</span
          >
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import InputSearch from "../components/InputSearch.vue";
import ContactCard from "../components/ContactCard.vue";
import ContactList from "../components/ContactList.vue";
import ContactService from "../services/contact.service";

export default {
  components: {
    ContactCard,
    InputSearch,
    ContactList,
  },
  data() {
    return {
      contacts: [],
      activeIndex: -1,
      searchText: "",
    };
  },
  watch: {
    searchText() {
      this.activeIndex = -1;
    },
  },
  computed: {
    contactStrings() {
      return this.contacts.map((contact) => {
        const { name, email, address, phone } = contact;
        return [name, email, address, phone].join("");
      });
    },

    filteredContacts() {
      if (!this.searchText) return this.contacts;
      return this.contacts.filter((_contact, index) =>
        this.contactStrings[index]
          .toLowerCase()
          .includes(this.searchText.toLowerCase())
      );
    },
    activeContact() {
      if (this.activeIndex < 0) return null;
      return this.filteredContacts[this.activeIndex];
    },
    filteredContactsCount() {
      return this.filteredContacts.length;
    },
  },
  methods: {
    // submitSearch(normalizedSearchText) {
    //   this.searchText = normalizedSearchText; // Cập nhật searchText với dữ liệu đã được chuẩn hóa
    // },

    async retrieveContacts() {
      try {
        this.contacts = await ContactService.getAll();
      } catch (error) {
        console.log(error);
      }
    },

    async refreshList() {
      await this.retrieveContacts();
      this.activeIndex = -1;
    },
    async removeAllContacts() {
      if (confirm("Are you sure you want remove all contacts")) {
        try {
          await ContactService.deleteAll();
          await this.refreshList();
        } catch (error) {
          console.log(error);
        }
      }
    },
    goToAddContact() {
      this.$router.push({ name: "contact.add" });
    },
    // submitSearch() {
    //   // Logic tìm kiếm ở đây
    // },
    updateActiveIndex(index) {
      this.activeIndex = index;
    },
  },
  mounted() {
    this.refreshList();
  },
};
</script>

<style scoped>
.page {
  max-width: 750px;
  text-align: left;
}
</style>
