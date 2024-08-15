<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card class="q-dialog-plugin rounded-md">
      <q-card-section class="row items-center">
        <q-btn icon="arrow_back" round flat unelevated v-close-popup></q-btn>
        <h5 class="text-h5 mx-auto">Edit Resource Allocation</h5>
      </q-card-section>
      <q-separator></q-separator>
      <AsyncData :state="resourceAllocationQuery">
        <template #default="{ data: resourceAllocation }">
          <q-card-section class="p-0">
            <div class="column gap-y-">
              <q-item class="my-1">
                <q-item-section avatar>
                  <q-avatar icon="mdi-tag-text-outline"></q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Resource</q-item-label>
                  <q-item-label class="text-body1">{{ resourceAllocation.resource.name }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator></q-separator>
              <q-item>
                <q-item-section avatar>
                  <q-avatar icon="mdi-numeric-2-box-multiple-outline"></q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Quantity</q-item-label>
                  <div class="row items-center gap-3">
                    <q-item-label class="text-body1">{{ resourceAllocation.quantity }}</q-item-label>
                    <q-chip>{{ resourceAllocation.resource.units }}</q-chip>
                  </div>
                </q-item-section>
                <q-item-section side>
                  <q-btn dense icon="edit" round flat color="grey-7">
                    <FieldPopupEdit
                      icon="mdi-numeric-2-box-multiple-outline"
                      label="Quantity"
                      field="quantity"
                      :originalValue="resourceAllocation.quantity"
                      type="number"
                      endpoint="/resource-allocations"
                      :rowId="resourceAllocation.id"
                      :queryKeyToUpdate="[ 'resourceAllocation', { id: resourceAllocation.id } ]"
                      :queryKeysToInvalidate="[['resourceAllocations']]"
                    ></FieldPopupEdit>
                  </q-btn>
                </q-item-section>
              </q-item>
              <q-separator></q-separator>
              <div class="grid grid-cols-[1fr,_auto,_1fr]">
                <q-item>
                  <q-item-section avatar>
                    <q-avatar icon="mdi-clipboard-text-clock-outline"></q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>Cost Type</q-item-label>
                    <q-item-label class="text-body1 capitalize">{{ resourceAllocation.costType }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn dense icon="edit" round flat color="grey-7">
                      <FieldPopupSelectEdit
                        icon="mdi-clipboard-text-clock-outline"
                        label="Cost Type"
                        field="costType"
                        :originalValue="resourceAllocation.costType"
                        :options="costTypeOptions"
                        endpoint="/resource-allocations"
                        :rowId="resourceAllocation.id"
                        :queryKeyToUpdate="[ 'resourceAllocation', { id: resourceAllocation.id } ]"
                        :queryKeysToInvalidate="[['resourceAllocations']]"
                      ></FieldPopupSelectEdit>
                    </q-btn>
                  </q-item-section>
                </q-item>
                <q-separator vertical spaced></q-separator>
                <q-item>
                  <q-item-section avatar>
                    <q-avatar icon="mdi-cash-multiple"></q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>Cost (Ksh.)</q-item-label>
                    <q-item-label class="text-body1">{{ resourceAllocation.costValue }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn dense icon="edit" round flat color="grey-7">
                      <FieldPopupEdit
                        icon="mdi-cash-multiple"
                        label="Cost"
                        field="costValue"
                        :originalValue="resourceAllocation.costValue"
                        type="number"
                        endpoint="/resource-allocations"
                        :rowId="resourceAllocation.id"
                        :queryKeyToUpdate="[ 'resourceAllocation', { id: resourceAllocation.id } ]"
                        :queryKeysToInvalidate="[['resourceAllocations']]"
                      ></FieldPopupEdit>
                    </q-btn>
                  </q-item-section>
                </q-item>
              </div>
              <q-separator></q-separator>
              <q-card-actions align="right" class="p-4">
                <q-btn color="negative" label="Delete Resource Allocation" @click="onDeleteResourceAllocation"></q-btn>
              </q-card-actions>
            </div>
          </q-card-section>
        </template>
      </AsyncData>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { deleteResourceAllocation, getResourceAllocationByIdQueryOption } from 'src/composables/api'
import { reactive } from 'vue'
import FieldPopupEdit from './FieldPopupEdit.vue'
import FieldPopupSelectEdit from './FieldPopupSelectEdit.vue'
import AsyncData from './AsyncData.vue'

const props = defineProps({
  resourceAllocationId: {
    type: [Number],
    required: true
  }
})
const resourceAllocationQuery = reactive(useQuery(getResourceAllocationByIdQueryOption(props.resourceAllocationId)))

defineEmits([
  ...useDialogPluginComponent.emits
])

const { dialogRef, onDialogHide } = useDialogPluginComponent()
const deleteResourceAllocationMutation = reactive(useMutation({
  mutationFn: deleteResourceAllocation
}))
const queryClient = useQueryClient()
const $q = useQuasar()
function onDeleteResourceAllocation () {
  $q.dialog({
    title: 'Delete Resource Allocation',
    message: 'Are you sure you want to delete this resource allocation?',
    persistent: true,
    ok: 'Yes',
    cancel: 'No'
  }).onOk(() => {
    deleteResourceAllocationMutation.mutateAsync(props.resourceAllocationId)
      .then(() => {
        queryClient.invalidateQueries(['resourceAllocation', { id: props.resourceAllocationId }])
        queryClient.invalidateQueries(['resourceAllocations'])
        onDialogHide()
      })
  })
}
const costTypeOptions = [
  { label: 'Per Hour', value: 'per hour' },
  { label: 'Per Day', value: 'per day' },
  { label: 'One Time', value: 'one time' }
]
</script>
