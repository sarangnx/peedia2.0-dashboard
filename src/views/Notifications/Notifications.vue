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
                            <!-- FILTER BY DISTRICT -->
                            <div class="col-12 mb-2 d-flex flex-column">
                                <label class="form-control-label">Audience</label>
                                <div class="d-flex flex-row align-items-baseline">
                                    <div>
                                        <base-dropdown position="left" menuClasses="drop__down m-0">
                                            <base-button slot="title" type="primary" class="dropdown-toggle" size="sm"
                                                :disabled="selectedLocalbody.name"
                                            >
                                                {{ selectedDistrict || 'District' }}
                                            </base-button>
                                            <a class="dropdown-item text-black" @click="selectedDistrict = null">None</a>
                                            <a class="dropdown-item text-black"
                                                v-for="(district, index) in districts"
                                                :key="index"
                                                @click="selectedDistrict = district.name"
                                            >
                                                <span class="text-capitalize">{{ district.name }}</span>
                                            </a>
                                        </base-dropdown>
                                    </div>
                                    <div class="p-2 mr-2">
                                        <h3 class="text-muted">OR</h3>
                                    </div>
                                    <div>
                                        <base-dropdown position="left" menuClasses="drop__down">
                                            <base-button slot="title" type="primary" class="dropdown-toggle" size="sm"
                                                :disabled="selectedDistrict"
                                            >
                                                {{ selectedLocalbody.name || 'Localbody' }}
                                            </base-button>
                                            <a class="dropdown-item text-black" @click="selectedLocalbody = Object.assign({})">None</a>
                                            <a class="dropdown-item text-black"
                                                v-for="(localbody, index) in localbodies"
                                                :key="index"
                                                @click="selectedLocalbody = Object.assign({}, localbody)"
                                            >
                                                <span class="text-capitalize">{{ localbody.name }}</span>
                                            </a>
                                        </base-dropdown>
                                    </div>
                                </div>
                                <div>
                                    <mark><small>If no options are selected, Notifications are sent to all users.</small></mark>
                                </div>
                            </div>
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
                            <div class="col-12 mt-3">
                                <base-button icon="fas fa-paper-plane" type="success"
                                    v-if="!loading"
                                    @click="sendNotification"
                                    block
                                >
                                    Send Notification
                                </base-button>
                                <base-button icon="fas fa-circle-notch fa-spin" type="success"
                                    v-else
                                    block
                                    disabled
                                ></base-button>
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
        notif_title: '',
        notif_body: '',
        loading: false,
        districts: [],
        localbodies: [],
        selectedDistrict: null,
        selectedLocalbody: {},
    }),
    methods: {
        sendNotification() {
            this.loading = true;

            let topic;
            if(this.selectedLocalbody && this.selectedLocalbody.localbody_id){
                topic = `localbody${this.selectedLocalbody.localbody_id}`;
            } else if(this.selectedDistrict) {
                topic = this.selectedDistrict;
            } else {
                topic = 'announcements'
            }

            const data = {
                notif_title: this.notif_title,
                notif_body: this.notif_body,
                topic,
            }

            this.$axios({
                method: 'post',
                url: '/notifications/send',
                data: data
            }).then((response) => {
                if(response.data && response.data.status === 'success'){

                    this.$success('Notifications sent successfully');

                    this.notif_title = '';
                    this.notif_body = '';
                }
            }).catch(() => {
                this.$error('Notification not sent');
            }).finally(() => {
                this.loading = false;
            });

        },
        listLocalbodies() {
            this.$axios({
                method: 'get',
                url: '/localbodies/list',
            }).then((response) => {
                const localbodies = response.data.localbodies.rows;

                this.localbodies = localbodies;
            });
        },
        listDistricts() {
            this.$axios({
                method: 'get',
                url: '/localbodies/districts',
            }).then((response) => {
                const districts = response.data.districts;

                this.districts = districts.rows;
            });
        },
    },
    mounted() {
        this.listDistricts();
        this.listLocalbodies();
    }
};
</script>
<style>
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
</style>
