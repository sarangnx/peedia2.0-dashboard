<template>
    <div>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
        </base-header>
        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col-12">
                    <tabs fill class="flex-column flex-md-row">
                        <card shadow>
                            <tab-pane>
                                <span slot="title">
                                    <i class="ni ni-fat-add">
                                        Add Item
                                    </i>
                                </span>
                                <add-item></add-item>
                            </tab-pane>

                            <tab-pane title="Add Items from Excel File">
                                <span slot="title">
                                    <i class="ni ni-bullet-list-67 mr-2">
                                        Add Items from Excel File
                                    </i>
                                </span>
                                <div class="row">
                                    <div class="col">
                                        <item-table></item-table>
                                    </div>
                                </div>
                            </tab-pane>
                        </card>
                    </tabs>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ItemTable from './Items/ItemTable';
import AddItem from './Items/AddItem';

export default {
    name: 'orders',
    components: {
        ItemTable,
        AddItem
    },
};
</script>
