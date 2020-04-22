import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js'

Vue.component('loader', {
    template: `
      <div style="display: flex;justify-content: center;align-items: center">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    `
})

new Vue({
    el: '#app',
    data() {
        return {
            loading: false,
            form: {
                name: '',
                value: ''
            },
            contacts: []
        }
    },
    computed: {
        canCreate() {
            return this.form.value && this.form.name
        }
    },
    methods: {
        async createContact() {
            const { ...contact } = this.form
            const newContact = await requestDB('/api/contacts', "POST", contact)
            this.contacts.push(newContact)

            console.log("Adding contact:", contact)

            this.form.name = this.form.value = ''
        },
        async markContact(id) {
            var contact = this.contacts.find(c => c.id == id)
            contact.marked = true
            var ok = await requestDB(`/api/contacts/${id}`, `PUT`,{...contact})
        },
        async deleteContact(id) {
            var ok = await requestDB(`/api/contacts/${id}`, `DELETE`)
            console.log("Deleting local", id, " -", ok)
            this.contacts = this.contacts.filter(c => c.id !== id)
        }
    },
    async mounted() {
        this.loading = true
        this.contacts = await requestDB('/api/contacts')
        this.loading = false
    }
})

async function requestDB(url, method = 'GET', data = null) {
    try {
        const headers = {}
        let body

        if (data) {
            headers['Content-Type'] = 'application/json'
            body = JSON.stringify(data)
        }

        const response = await fetch(url, {
            method,
            body,
            headers
        })

        return await response.json()
    } catch (error) {
        console.warn("Error", e.message);
    }
}