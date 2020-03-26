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
        <base-input v-model="item.market_price" class="col-6"></base-input>

        <div class="col-12">
            <h3>Category</h3>
        </div>
        <!-- CATEGORY -->
        <div class="form-group col-12 col-md-6">
            <base-input
                v-model="category.category_name"
                class="mr-sm-2"
                @focus="selectCategoryModal = true"
            >
            </base-input>
            <modal :show.sync="selectCategoryModal" bodyClasses="pt-0">
                <template slot="header">
                    <h3 class="modal-title">Select Category</h3>
                </template>
                <select-category
                    @category="selectCategory"
                    @close="selectCategoryModal = false"
                ></select-category>
            </modal>
        </div>
        <!-- CATEGORY -->

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
import SelectCategory from './SelectCategory';

export default {
    name: "edit-item",
    components: {
        SelectCategory,
    },
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
        item: {},
        category: {
            category_name: ''
        }, // selected category
        selectCategoryModal: false,
    }),
    computed: {
        storeId() {
            return this.$store.getters.getUser.store[0].store_id;
        },
        baseUrl() {
            // base url of api server where images are uploaded.
            return this.$store.getters.serverUrl;
        },
    },
    watch: {
        edit() {
            // send request to server only when the modal is
            // in visible state and item_id is not null.
            if( this.edit === false || this.item_id === null ){
                this.item = {};
                this.category = {
                    category: {
                        category_name: ''
                    },
                };
                // remove selected image from file input buffer.
                this.$refs.file.value = this.$refs.file.defaultValue;
                return;
            }
            this.loadItem(this.item_id);
        },
    },
    methods: {
        selectCategory(category) {
            this.category = Object.assign({}, this.category, category);
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

            }
        },
        openImage() {
            // open the file selector.
            this.$refs.file.click();
        },
        upload() {
            const data = this.item;
            // assign category id from selected category
            data.category_id = this.category.category_id;

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
                url: `/inventory/item/${this.item_id}`,
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
                url: `/inventory/items/${item_id}`
            }).then((response) => {
                const item = response.data.data.item;

                this.item = Object.assign({}, this.item, item);
                this.category = Object.assign({}, this.category, item.category[0]);
                // set the image src link on loading an item info from the server.
                if(this.item.image_path){
                    this.$refs.image.setAttribute('src',`${this.baseUrl}/images/inventory/${this.item.image_path}`);
                }
            });
        }
    },
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
