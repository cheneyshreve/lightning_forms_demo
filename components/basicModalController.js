({
  onInit: function (component, event, helper) {

   /* In the component, we're using implements="force:hasRecordId"
      so we can simply retrieve the associated recordId. This won't
      "work" until you've wired up your component to reference a record,
      e.g. once you assign your lightning component as a custom button
      or quick action on an object. For debugging, you could set a default Id*/
    var recordId = component.get("v.recordId");
    component.set("v.newLead.AccountId", recordId);
    helper.fetchPicklistValues(component, 'Industry', 'industryAuraID');
  },
  onSelectIndustry: function (component, event, helper) {
    /* this function is retrieving the industry option selected by
    the user and assigning it to the newLead variable */
    var industryPicklistSelection = event.getSource().get("v.value");
    component.set("v.newLead.Industry", industryPicklistSelection);
  },
  validateEmail: function (component, event, helper) {
   /* calls a function in the helper method that uses
    a regExp to validate email input */
    helper.validateEmailInput(component);
  },
  validatePhoneNumber: function(component,event,helper){
      /* using getSource() & getLocalId() methods lets us determine
       which phone number input is referenced, letting us reuse the
       validatePhoneNumber helper method */
      var source = event.getSource();
      var id = source.getLocalId();

      if(id == 'mobilePhoneId'){
          helper.validatePhoneNumber(component,'mobilePhoneId','MobilePhone');
      } else if(id == 'phoneId'){
          helper.validatePhoneNumber(component,'phoneId','Phone');
      }
  },
  onSave: function(component, event, helper){

    /* validate standard form fields */
    var validInput = component.find('formInput').reduce(function (validSoFar, inputCmp) {
      inputCmp.showHelpMessageIfInvalid();
      return validSoFar && inputCmp.get('v.validity').valid;
    }, true);

    /* custom validation for picklist field */
    helper.validatePhoneNumber(component,'phoneId','Phone');
    helper.validatePhoneNumber(component,'mobilePhoneId','MobilePhone');
    var hasEmailErrors = component.get("v.hasEmailErrors");
    var hasPhoneErrors = component.get("v.hasPhoneErrors");
    helper.validatePicklist(component,'industryAuraID');
    var hasPicklistErrors = component.get("v.hasPicklistErrors");
    var newLead = component.get("v.newLead");
    var postalCode = component.get("v.postalCode");

    /* debug is variable used here for debugging -- set it to
    false when you're through debugging to avoid console.log statements. */
    var debug = true;
      if(debug){
        Object.keys(newLead).forEach(function(key){
            console.log(key + ': ' + newLead[key]);
        });
      }

      if(hasEmailErrors == false && hasPhoneErrors == false && hasPicklistErrors == false){
          /* pass the newLead variable to server-side method to
             save the new Lead */
          var action = component.get("c.createLead");
          action.setParams({
            "newLead": newLead,
            "postalCode": postalCode
          });

          action.setCallback(this, function (response) {

            var state = response.getState();

            if (state === "SUCCESS") {

                var resultsToast = $A.get("e.force:showToast");

                resultsToast.setParams({
                    "title": "Success",
                    "message": "New Lead was created.",
                    "type": "success"
                  });

                  resultsToast.fire();
                  $A.get("e.force:refreshView").fire();
                  $A.get("e.force:closeQuickAction").fire();

            } else if (state === "ERROR") {

                  var errors = response.getError();
                  helper.handleErrors(component, errors);
           }
          }
        );
      $A.enqueueAction(action);
      }

  },
  onCancel: function (component, event, helper) {

    $A.get("e.force:closeQuickAction").fire();
  },
})
