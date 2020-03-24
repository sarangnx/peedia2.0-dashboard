<template>
    <div>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
        </base-header>
        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col-12">
                    <div class="card shadow">
                        <div  class="card-header d-flex justify-content-between">
                            <h3>Send Notifications</h3>
                        </div>
                        <div class="card-body">
                            <div class="col-12">
                                <label class="form-control-label">Notification Title</label>
                                <base-input v-model="notif_title" placeholder="Keep it very short!"></base-input>
                            </div>
                            <div class="col-12">
                                <label class="form-control-label">Notification Body</label>
                                <base-input v-model="notif_body"
                                    placeholder="Limit to 1 or 2 sentences."
                                ></base-input>
                            </div>
                            <div class="col-12">
                                <label class="form-control-label">Offer</label>
                                <div v-if="selected.offer_id" class="selected d-flex justify-content-between align-items-center">
                                    <div>
                                        <span class="pr-3">{{ selected.offer_name }}</span>
                                        <span v-if="selected.offer_status" class="badge badge-success">
                                            Active
                                        </span>
                                        <span v-else class="badge badge-danger">
                                            Inactive
                                        </span>
                                    </div>
                                    <base-button type="danger" size="sm" icon="fa fa-times" @click="clearSelected()"></base-button>
                                </div>
                                <input v-else @keyup="suggest()" ref="suggest" class="form-control" 
                                    placeholder="Search for Offers"
                                >
                                <div v-if="searchDropdown" class="search-container">
                                    <div class="search-results">
                                        <span class="px-2 py-1 text-muted">Search results</span>
                                        <a class="px-2 py-1 d-flex justify-content-between align-items-center"
                                            v-for="(item, index) in offers"
                                            :key="item.offer_id"
                                            @click="selectItem(index)"
                                        >
                                            <span class="pl-3">{{ item.offer_name }}</span>
                                            <span v-if="item.offer_status" class="badge badge-success">
                                                Active
                                            </span>
                                            <span v-else class="badge badge-danger">
                                                Inactive
                                            </span>
                                        </a>
                                    </div>
                                </div> <!-- dropdown -->
                            </div> <!-- col-12 -->
                            <div class="col-12 mt-3">
                                <base-button icon="fa fa-paper-plane" type="success"
                                    :disabled="disabled"
                                    @click="sendNotification"
                                >Send Notification</base-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'notifications',
    data: () => ({
        selected: {},
        searchDropdown: false,
        debounce: null, // for debounced search
        offers: [],
        notif_title: '',
        notif_body: '',
        disabled: false
    }),
    methods: {
        suggest() {
            clearTimeout(this.debounce);

            const self = this;

            // send server request only when user stops typing.
            this.debounce = setTimeout(() => {
                const search = self.$refs.suggest.value;

                if(search === ''){
                    this.searchDropdown = false;
                    return;
                }

                self.$axios({
                    method: 'get',
                    url: '/offers/suggest',
                    params: {
                        search: search,
                    }
                }).then((response) => {
                    const data = response.data.data;

                    this.offers = data.offers;
                    this.count = data.count;
                    this.searchDropdown = true;
                });

            }, 700);
        },
        selectItem(index) {
            this.selected = Object.assign({}, this.offers[index]);
            this.searchDropdown = false;
        },
        clearSelected() {
            this.selected = Object.assign({}, {});
        },
        sendNotification() {
            this.disabled = true;

            const data = {
                notif_title: this.notif_title,
                notif_body: this.notif_body,
                offer_id: this.selected ? this.selected.offer_id: null
            }

            this.$axios({
                method: 'post',
                url: '/notifications/send',
                data: data
            }).then((response) => {
                if(response.data && response.data.status === 'success'){

                    this.$notify({
                        type: 'success',
                        title: 'Success',
                        message: 'Notifications sent successfully'
                    });

                    this.disabled = false;
                    this.selected = Object.assign({}, {});
                    this.offers = [];
                    this.notif_title = '';
                    this.notif_body = '';
                }
            }).catch(() => {
                
                this.$notify({
                    type: 'danger',
                    title: 'Something went wrong!',
                    message: 'Notification not sent'
                });
                this.disabled = false;
            });

        },
    }
};
</script>
<style scoped>
.search-container {
    position: relative;
    width: 100%;
}
.search-results {
    position: absolute;
    z-index: 1000;
    background: white;
    width: 100%;
    box-shadow: 0px 3px 5px -2px black;
    max-height: 200px;
    overflow: hidden;
    padding: 10px;
}
.search-results:hover{
    overflow-y: auto;
}
/* --- Scrollbar --- */
.search-results::-webkit-scrollbar {
    width: 6px;
}
.search-results::-webkit-scrollbar-track {
    background: transparent;
}
.search-results::-webkit-scrollbar-thumb {
    background: #43c2ff;
}
.search-results::-webkit-scrollbar-thumb:hover {
    background: #004fff;
}

.search-results > span {
    display: block
}
.search-results > a {
    display: block;
    cursor: pointer;
}
.search-results > a:hover {
    background: #e8e8e8;
}

.selected {
    padding: 15px;
    border: 1px solid #d7d7d7;
    border-radius: 10px;
}
</style>
