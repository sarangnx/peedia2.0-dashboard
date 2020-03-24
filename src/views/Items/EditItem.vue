<template>
    <div class="row">
        <div class="col-12 px-0 row">
            <base-input v-model="item.item_name" label="Product Name" class="col-12 col-md-6" maxlength="200"></base-input>
            <input type="file" ref="file" @change="loadImage($event)" class="hidden"/>
            <div class="col-12 col-md-6 image-container" ref="imagecontainer">
                <img v-show="item.image_path" ref="image" src="#" class="col-12 p-0">
                <i v-show="!item.image_path" class="ni ni-image ni-5x col-12 text-center"></i> <!-- Alt Image -->
                <div class="image-overlay">
                    <div class="d-flex justify-content-center align-items-center height">
                        <base-button type="success" icon="ni ni-camera-compact" @click="openImage()">
                            <span class="text-white">Change Image</span>
                        </base-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12">
            <h3>Base Quantity</h3>
        </div>
        <base-input v-model="item.quantity" label="Quantity" class="col-6" type="number" min="1"></base-input>

        <div class="form-group col-6">
            <label class="form-control-label">Unit</label>
            <select v-model="item.unit" class="custom-select mr-sm-2">
                <option>kg</option>
                <option>g</option>
                <option>l</option>
                <option>ml</option>
                <option>count</option>
            </select>
        </div>
        <div class="col-12">
            <h3>Price</h3>
        </div>
        <base-input v-model="item.market_price" label="Market Price" class="col-6"></base-input>

        <base-input v-model="item.offer_price" label="Offer Price" class="col-6"></base-input>

        <div class="col-12">
            <h3>Brand & Category</h3>
        </div>
        <!-- BRAND -->
        <div class="form-group col-12 col-md-6">
            <label class="form-control-label">Brand</label>
            <select v-model="item.brand_id" class="custom-select mr-sm-2">
                <option selected="selected" :value="0">None</option>
                <option
                    v-for="brand in brands"
                    :key="brand.brand_id"
                    :value="brand.brand_id"
                >
                    {{brand.brand_name}}
                </option>
            </select>
        </div>
        <!-- BRAND -->

        <!-- CATEGORY -->
        <div class="form-group col-12 col-md-6">
            <label class="form-control-label">Category</label>
            <select
                v-model="item.category_id"
                class="custom-select mr-sm-2"
                @change="item.sub_category_id = 0;item.sub_sub_category_id = 0;"
            >
                <option selected="selected" :value="0">None</option>
                <option
                    v-for="category in categories"
                    :key="category.category_id"
                    :value="category.category_id"
                >
                    {{category.category_name}}
                </option>
            </select>
        </div>
        <!-- CATEGORY -->

        <!-- SUB CATEGORY -->
        <div class="form-group col-12 col-md-6">
            <label class="form-control-label">Sub Category</label>
            <select
                v-model="item.sub_category_id"
                class="custom-select mr-sm-2"
                @change="item.sub_sub_category_id = 0;"
            >
                <option selected="selected" :value="0">None</option>
                <option
                    v-for="subCategory in subCategories[item.category_id]"
                    :key="subCategory.sub_category_id"
                    :value="subCategory.sub_category_id"
                >
                    {{subCategory.sub_category_name}}
                </option>
            </select>
        </div>
        <!-- SUB CATEGORY -->

        <!-- SUB SUB CATEGORY -->
        <div class="form-group col-12 col-md-6">
            <label class="form-control-label">Sub Sub Category</label>
            <select v-model="item.sub_sub_category_id" class="custom-select mr-sm-2">
                <option selected="selected" :value="0">None</option>
                <option
                    v-for="subSubCategory in subSubCategories[item.sub_category_id]"
                    :key="subSubCategory.sub_sub_category_id"
                    :value="subSubCategory.sub_sub_category_id"
                >
                    {{subSubCategory.sub_sub_category_name}}
                </option>
            </select>
        </div>
        <!-- SUB SUB CATEGORY -->

        <!-- <div class="form-group col-12">
            <div class="input-group">
                <div class="custom-file">
                    <label class="custom-file-label" ref="image">Product Image</label>
                </div>
                <div class="input-group-append">
                    <base-button 
                        type="danger"
                        icon="ni ni-lg ni-fat-remove"
                        @click.prevent="removeImage()"
                    >
                    </base-button>
                </div>
            </div>
        </div> -->

        <div class="form-group col">
            <base-button
                type="success"
                icon="ni ni-cloud-upload-96"
                @click.prevent.stop="upload()"
            >Save</base-button>
        </div>
    </div>
</template>
<script>
export default {
    name: "edit-item",
    props: {
        item_id: {
            type: [String, Number],
        },
        edit: {
            type: Boolean,
            default: false,
        }
    },
    data: () => ({
        item: {
            brand_id: 0,
            category_id: 0,
            sub_category_id: 0,
            sub_sub_category_id: 0,
        },
        brands: {},
        categories: {},
        subCategories: {},
        subSubCategories: {}
    }),
    computed: {
        storeId() {
            return this.$store.getters.getUser.store[0].store_id;
        },
        baseUrl() {
            // base url of api server where images are uploaded.
            return this.$store.getters.apiUrl;
        },
    },
    watch: {
        edit() {
            // send request to server only when the modal is
            // in visible state and item_id is not null.
            if( this.edit === false || this.item_id === null ){
                this.item = null;
                this.item = {
                    brand_id: 0,
                    category_id: 0,
                    sub_category_id: 0,
                    sub_sub_category_id: 0,
                };
                // remove selected image from file input buffer.
                this.$refs.file.value = this.$refs.file.defaultValue;
                return;
            }
            this.loadItem(this.item_id);
        },
    },
    methods: {
        getBrands() {
            // Get list of brands for drop down list.
            this.$axios({
                method: "get",
                url: "/api/inventory/brands"
            }).then(response => {
                if (response.data.status === "success") {
                    this.brands = response.data.data.brands;
                }
            });
        },
        getAllCategories() {
            // return if already loaded.
            if (Object.entries(this.subCategories).length !== 0) {
                return;
            }

            // Get list of categories for drop down list
            this.$axios({
                method: 'get',
                url: '/api/inventory/categories/all',
            }).then((response) => {
                if( response.data.status === 'success' ){

                    // assign to this.categories.
                    this.categories = Object.assign(
                        {},
                        this.categories,
                        response.data.data.categories.map((item) => {
                            return {
                                category_id: item.category_id,
                                category_name: item.category_name
                            }
                        })
                    );

                    response.data.data.categories.forEach((item) => {
                        // Assign to sub category.
                        const sub_categories = item.sub_category.map((sub_item) => {
                            return {
                                sub_category_id: sub_item.sub_category_id,
                                sub_category_name: sub_item.sub_category_name,
                            }
                        });

                        this.subCategories = Object.assign({}, this.subCategories,{
                            [item.category_id]: sub_categories
                        });

                        // assign to sub sub categories.
                        item.sub_category.forEach((sub_item) => {
                            const sub_sub_categories = sub_item.sub_sub_category.map((sub_sub_item) => {
                                return {
                                    sub_sub_category_id: sub_sub_item.sub_sub_category_id,
                                    sub_sub_category_name: sub_sub_item.sub_sub_category_name,
                                }
                            });

                            this.subSubCategories = Object.assign({}, this.subSubCategories,{
                                [sub_item.sub_category_id]: sub_sub_categories
                            });
                        });

                    });
                }
            });
        },
        loadImage(event) {
            this.item.image = event.target.files[0];
            if(event.target.files[0]){

                let reader = new FileReader();

                // const self = this;
                reader.onload = (e) => {
                    this.$refs.image.setAttribute('src', e.target.result);
                    // set v-show=true for <img> tag
                    if(!this.item.image_path){
                        this.item.image_path = true;
                    }
                };

                reader.readAsDataURL(event.target.files[0]);
                
            } else {
                // this.$refs.image.innerHTML = 'Product Image';
            }
        },
        openImage() {
            // open the file selector.
            this.$refs.file.click();
        },
        upload() {
            const data = this.item;

            // remove keys with null or undefined or 0 value.
            for (let key in data) {
                if(!data[key]) {
                    delete data[key];
                }
            }

            // Wrap it as formdata.
            const formdata = new FormData();
            Object.keys(data).forEach(key => {
                formdata.append(key, data[key]);
            });

            this.$axios({
                method: "patch",
                url: `/api/inventory/item/${this.item_id}`,
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                data: formdata
            }).then((response) => {
                if (response.data && response.data.status === "success") {

                    // Emit an event close on successful submit
                    this.$emit('close-edit');

                    this.$notify({
                        type: "success",
                        title: "Success",
                        message: "Item updated"
                    });
                } else {
                    this.$notify({
                        type: "danger",
                        title: "Something went Wrong",
                        message: "Item not updated"
                    });
                }
            }).catch(() => {
                this.$notify({
                    type: "danger",
                    title: "Something went Wrong",
                    message: "Item not updated"
                });
            });
        },
        loadItem(item_id) {
            this.$axios({
                method: 'get',
                url: `/api/inventory/items/${item_id}`
            }).then((response) => {
                const data = response.data.data.item;
                
                const category_id = data.category && data.category[0] ? data.category[0].category_id : 0;
                const sub_category_id = data.sub_category && data.sub_category[0] ? data.sub_category[0].sub_category_id : 0;
                const sub_sub_category_id = data.sub_sub_category && data.sub_sub_category[0] ? data.sub_sub_category[0].sub_sub_category_id : 0;

                const item = {
                    item_id: data.item_id,
                    item_name: data.item_name,
                    market_price: data.market_price,
                    offer_price: data.offer_price,
                    quantity: data.quantity,
                    unit: data.unit,
                    store_id: data.store_id,
                    category_id,
                    sub_category_id,
                    sub_sub_category_id,
                    image_path: data.image_path
                };
                
                this.item = Object.assign({}, this.item, item);
                // set the image src link on loading an item info from the server.
                if(this.item.image_path){
                    this.$refs.image.setAttribute('src',`${this.baseUrl}/images/inventory/${this.item.image_path}`);
                }
            });
        }
    },
    mounted() {
        // load category and brand list.
        this.getBrands();
        this.getAllCategories();
    }
};
</script>
<style scoped>
.hidden {
    display: none;
}
.height {
    height: 100%;
}
.image-overlay {
    cursor: pointer;
}
.image-container .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
    color: white;
}
.image-container:hover .image-overlay {
    display: block;
    background: rgba(0,0,0,0.4);
}
</style>
