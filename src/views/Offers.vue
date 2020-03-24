<template>
    <div>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
        </base-header>
        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col-12">
                    <tabs fill class="flex-column flex-md-row">
                        <card shadow>
                            <!-- ADD OFFERS -->
                            <tab-pane>
                                <span slot="title">
                                    <font-awesome-icon icon="plus"></font-awesome-icon>
                                    <span class="pl-3">Add Offers</span>
                                </span>
                                <add-offer></add-offer>
                            </tab-pane>
                            <!-- ACTIVE OFFERS -->
                            <tab-pane>
                                <span slot="title">
                                    <font-awesome-icon icon="check-square"></font-awesome-icon>
                                    <span class="pl-3">Active Offers</span>
                                </span>
                                <view-offers status="active"></view-offers>
                            </tab-pane>
                            <!-- OFFER HISTORY -->
                            <tab-pane>
                                <span slot="title">
                                    <font-awesome-icon icon="history"></font-awesome-icon>
                                    <span class="pl-3">Offer History</span>
                                </span>
                                <view-offers status="all"></view-offers>
                            </tab-pane>
                        </card>
                    </tabs>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import AddOffer from './Offers/AddOffer';
import ViewOffers from './Offers/ViewOffers';

export default {
    name: 'offers',
    components: {
        AddOffer,
        ViewOffers
    }
};
</script>
