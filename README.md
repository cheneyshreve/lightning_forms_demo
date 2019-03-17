# Lightning modal demo with basic form
More information on this code can be found in this Medium blog.

# Setup & installation
1 - Create a new lightning component named 'basicModal' from the developer's console or your favorite IDE.<br>
2 - Copy and paste the 'basicModal.cmp', next click on the 'Controller' from within the component window, copy and paste the 'basicModalController.js' code. Next click on 'Helper' and copy and paste the 'basicModalHelper.js'<br>
3 - Create 3 new apex classes: 'CustomExceptionData', 'serverSideController',
and 'serverSideControllerTest'. Copy and paste in the code from the Apex folder.<br>
4 - Add the Quick Action as a lightning component under 'buttons, actions & links' on the Account Object. Give it a name like 'Quick Lead', and make sure you select the 'basicModal' component.<br>
5 - Add the Quick Action to the default page layout on Account under 'Lightning Mobile & Quick Actions'.
For help with any of these steps, reference the blog, or checkout the gifs below.<br>

Installing a quick action:<br>
![alt text](https://raw.githubusercontent.com/cheneyshreve/lightning_forms_demo/images/wireTheQuickAction.gif)
<br>

What the end result looks like:<br>
![alt text](https://raw.githubusercontent.com/cheneyshreve/lightning_forms_demo/images/quickActionDemo.gif)
<br>
