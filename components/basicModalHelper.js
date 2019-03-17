({
  /* modified from an example from http://sfdcmonkey.com
     on client-side, I modified variable names for readiability
     on server-side, I modified by adding in error handling & testing
  */
  fetchPicklistValues: function (component, fieldName, auraId) {
    var action = component.get("c.getselectOptions");
    action.setParams({
      "targetObject": component.get("v.objectName"),
      "picklistField": fieldName
    });
    var opts = [];
    action.setCallback(this, function (response) {
        console.log('callbackResponse picklist: ' + response.getReturnValue());
      if (response.getState() == "SUCCESS") {
        var allValues = response.getReturnValue();

        if (allValues != undefined && allValues.length > 0) {
          opts.push({
            class: "optionClass",
            label: "--- None ---",
            value: ""
          });
        }
        for (var i = 0; i < allValues.length; i++) {
          opts.push({
            class: "optionClass",
            label: allValues[i],
            value: allValues[i]
          });
        }
        component.find(auraId).set("v.options", opts);
      }
    });
    $A.enqueueAction(action);
 },
  validateEmailInput: function (component) {
    /* I modified this code from an example by http://sfdcmonkey.com */
    var isValidEmail = true;
    var emailField = component.find("emailId");
    var emailFieldValue = emailField.get("v.value");
    var regExpEmailformat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!$A.util.isEmpty(emailFieldValue)) {

      if (emailFieldValue.match(regExpEmailformat)) {

        $A.util.removeClass(emailField, 'slds-has-error');
        emailField.set("v.errors", null);
        component.set('v.newLead.Email', emailFieldValue);
        isValidEmail = true;
        component.set("v.hasEmailErrors", false);
      } else {

        $A.util.addClass(emailField, 'slds-has-error');
        emailField.set("v.errors", [{ message: "Please enter a valid email." }]);
        isValidEmail = false;
        component.set("v.hasEmailErrors", true);
      }
    }
  },
   validatePhoneNumber: function(component, fieldId, fieldName){
   /* I modified this code from an example by http://sfdcmonkey.com
      The reg exp is subbed out for a more specific one from
      this reg exp library http://regexlib.com.
    */
    var isValidPhone = true;
    var phoneField = component.find(fieldId);
    var phoneFieldValue = phoneField.get("v.value");
    var regExpPhoneformat = /^([0-9]( |-)?)?(\(?[0-9]{3}\)?|[0-9]{3})( |-)?([0-9]{3}( |-)?[0-9]{4}|[a-zA-Z0-9]{7})$/;

    if (!$A.util.isEmpty(phoneFieldValue)) {

      if (phoneFieldValue.match(regExpPhoneformat)) {

        phoneField.set("v.errors", null);
        $A.util.removeClass(phoneField, 'slds-has-error');
        isValidPhone = true;
        component.set('v.newLead.' + fieldName, phoneFieldValue);
        component.set("v.hasPhoneErrors", false);
      } else {
        $A.util.addClass(phoneField, 'slds-has-error');
        phoneField.set("v.errors", [{ message: "Please enter a valid phone number." }]);
        isValidPhone = false;
        component.set("v.hasPhoneErrors", true);
      }

    }
  },
   validatePicklist: function(component, fieldId){
    /* simple function to make sure user selected a picklist option */
    var isValidPicklistEntry = true;
    var picklistField = component.find(fieldId);
    var picklistValue = picklistField.get("v.value");
      if(picklistValue.length < 1){
          picklistField.set("v.errors", [{ message: "Select an option from the dropdown."}]);
          isValidPicklistEntry = false;
          component.set("v.hasPicklistErrors", true);
      } else {
          picklistField.set("v.errors", null);
          component.set("v.hasPicklistErrors", false);
      }
   },
   handleErrors : function(component,errors) {

      /* one of the known issues with lightning is that the resultsToast
      error messaging doesn't display on top of the modal. The success banner
      work just fine because that fires off after the modal closes.
      A workaround is to use the notification library, which will display
      on top of the modal. */

      var message = 'Unknown error';

      if (errors && Array.isArray(errors) && errors.length > 0) {
        message = errors[0].message;
      }
      console.error(message);

      component.find('notifLib').showNotice({
         "variant": "error",
         "header": "Something has gone wrong!",
         "message": "An unknown error has occurred."
      });

},
})
