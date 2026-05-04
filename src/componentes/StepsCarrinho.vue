<script setup>
    const props = defineProps({
        currentStep: {
            type: Number,
            default: 1
        }
    })

    const steps = [
        { n: 1, label: 'Carrinho' },
        { n: 2, label: 'Finalizar' },
        { n: 3, label: 'Confirmação' }
    ]
</script>

<template>
    <div class="steps-card">
        <div class="steps-row">
            <template v-for="(step, i) in steps" :key="step.n">
                <div class="step-it">
                    <div class="step-circ"
                        :class="{
                            act: step.n === props.currentStep,
                            don: step.n < props.currentStep,
                            ina: step.n > props.currentStep
                        }">
                        <svg v-if="step.n < props.currentStep" width="14" height="14" viewBox="0 0 24 24" stroke="white" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        <span v-else>{{ step.n }}</span>
                    </div>
                    <div class="step-lbl"
                        :class="{
                            act: step.n === props.currentStep,
                            don: step.n < props.currentStep,
                            ina: step.n > props.currentStep
                        }">
                        {{ step.label }}
                    </div>
                </div>
                <div v-if="i < steps.length - 1" class="step-line" :class="{ done: step.n < props.currentStep }"></div>
            </template>
        </div>
    </div>
</template>

<style scoped>
    .steps-card {
        background: #fff;
        border: 1px solid #e2e6f0;
        border-radius: 16px;
        padding: 22px 32px;
        margin-bottom: 22px;
        box-shadow: 0 2px 12px rgba(17,71,152,.09);
    }
    .steps-row {
        display: flex;
        align-items: flex-start;
    }
    .step-it {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        flex: 1;
    }
    .step-circ {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 800;
    }
    .step-circ.act {
        background: linear-gradient(135deg, #2C18A0, #114798);
        color: #fff;
        box-shadow: 0 4px 12px rgba(44,24,160,.3);
    }
    .step-circ.don {
        background: #049377;
        color: #fff;
    }
    .step-circ.ina {
        background: #f0f2f7;
        color: #9aa3bb;
        border: 1.5px solid #e2e6f0;
    }
    .step-lbl {
        font-size: 11px;
        font-weight: 600;
        text-align: center;
    }
    .step-lbl.act { color: #114798; }
    .step-lbl.don { color: #049377; }
    .step-lbl.ina { color: #9aa3bb; }
    .step-line {
        flex: 1;
        height: 2px;
        background: #e2e6f0;
        align-self: flex-start;
        margin-top: 17px;
    }
    .step-line.done {
        background: #049377;
    }
</style>
