<template>
    <div class="container">
        <div class="row align-items-center mb-3">
            <div class="col">
                <h1 class="mb-0">Add Offer</h1>
            </div>
        </div>
        <div class="row">
            <div class="col-12 col-md-6">
                <label class="form-control-label">Offer Name</label>
                <base-input v-model="offer.offer_name" maxlength="100"></base-input>
            </div>
            <div class="col-12">
                <label class="form-control-label">Offer Description</label>
                <textarea class="form-control" rows="3" 
                    placeholder="Describe the offer here ..."
                    maxlength="300"
                    v-model="offer.offer_description"
                ></textarea>
            </div>
            <div class="col-12 mt-4">
                <label class="form-control-label">Offer Status</label>
                <span class="clearfix"></span>
                <base-switch :value="offer.offer_status" @click="toggleStatus()"></base-switch>
            </div>
            <div class="col-12 col-md-6">
                <label class="form-control-label">Discount Percentage</label>
                <base-input v-model="offer.discount_percentage"
                    min="0" max="100" type="number"
                    addon-right-icon="fa fa-percent"
                >
                </base-input>
            </div>
            <div class="col-12 mt-3">
                <h3>Items</h3>
                <input @keyup="suggest()" ref="suggest" class="form-control"
                    placeholder="Search for items"
                >
                <div v-if="searchDropdown" class="search-container">
                    <div class="search-results">
                        <span class="px-2 py-1 text-muted">Search results</span>
                        <a class="px-2 py-1"
                            v-for="(item, index) in items"
                            :key="item.item_id"
                            @click="selectItem(index)"
                        >
                            <img v-if="item.image_path" :src="`${baseUrl}/images/inventory/${item.image_path}`" class="item-image">
                            <i v-else class="ni ni-image"></i> <!-- Alt Image -->
                            <span class="pl-3">{{ item.item_name }}</span>
                        </a>
                    </div>
                </div>
                <div class="mt-3" v-if="selected.length">
                    <h5>Selected Items</h5>
                    <div class="selected">
                        <div
                            v-for="(item, index) in selected"
                            :key="index"
                            class="selected-item"
                        >
                            <img v-if="item.image_path" 
                                :src="`${baseUrl}/images/inventory/${item.image_path}`" 
                                class="item-image"
                            >
                            <i v-else class="ni ni-image"></i> <!-- Alt Image -->
                            <span class="pl-3">{{ item.item_name }}</span>
                            <base-button type="danger" size="sm" icon="fa fa-times" iconOnly
                                class="ml-3"
                                @click="clearSelected(index)"
                            >
                            </base-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 mt-3">
                <base-button
                    type="success"
                    icon="fa fa-plus"
                    @click="addOffer"
                    :disabled="disabled"
                >
                    Add Offer
                </base-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'add-offer',
    data: () => ({
        offer: {
            offer_name: '',
            offer_description: '',
            discount_percentage: 0,
            offer_status: false
        },
        items: [],
        searchDropdown: false,
        selected: [],
        disabled: false
    }),
    computed: {
        baseUrl() {
            // base url of api server where images are uploaded.
            return this.$store.getters.apiUrl;
        },
    },
    methods: {
        toggleStatus() {
            this.offer.offer_status = !this.offer.offer_status;
        },
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
                    url: '/inventory/suggest',
                    params: {
                        search: search,
                    }
                }).then((response) => {
                    const data = response.data.data;

                    this.items = data.items;
                    this.searchDropdown = true;
                });

            }, 700);
        },
        selectItem(index) {
            let check_item = this.selected.findIndex((element) => {
                return element.item_id === this.items[index].item_id;
            });

            // returns index -1 if not found
            if( check_item === -1 ){

                // Select item only if no offers are applied to it.
                if ( this.items[index].offer_price !== null && this.items[index].offer_price < this.items[index].market_price ){
                    this.$notify({
                        type: "danger",
                        title: "Cannot Select This Item",
                        message: "This item already has an offer applied."
                    });
                } else {
                    this.selected.push(this.items[index]);
                    this.searchDropdown = false;
                }

            } else {
                this.searchDropdown = false;
            }

        },
        clearSelected(index) {
            this.selected.splice(index, 1);
        },
        addOffer() {
            // disable button
            this.disabled = true;

            // extract data from form elemets.
            let data = this.offer;
            data.items = this.selected.map((item) => item.item_id);

            // send alert and abort if no items selected
            if(data.items.length === 0){
                this.$notify({
                    type: "danger",
                    title: "No Items Selected",
                    message: "Select atleast 1 Item."
                });
                this.disabled = false;
                return;
            }

            this.$axios({
                method: 'post',
                url: '/offers/add',
                data: data
            }).then((response) => {
                if(response.data && response.data.status === 'success'){
                    this.$notify({
                        type: "success",
                        title: "Success",
                        message: "Offer Added"
                    });

                    // Reset the form on successful submission
                    this.offer = Object.assign({},{
                        offer_name: '',
                        offer_description: '',
                        discount_percentage: 0,
                        offer_status: false
                    });
                    this.items = [];
                    this.selected = [];
                }
            }).catch((err) => {
                this.$notify({
                    type: "danger",
                    title: "Error",
                    message: "Offer could not be added."
                });
            });

            this.disabled = false;
        }
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
.item-image {
    height: 20px;
}

.selected {
    padding: 15px;
    border: 1px solid #d7d7d7;
    border-radius: 10px;
    display: flex;
    justify-content: flex-start;
}
.selected-item {
    padding: 5px;
    border: 1px solid #d7d7d7;
    border-radius: 10px;
    display: flex;
    align-items: center
}
</style>
