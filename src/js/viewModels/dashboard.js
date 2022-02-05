/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(["accUtils",
        "knockout",
        'jquery',
        "ojs/ojarraydataprovider",
        "ojs/ojlabel",
        'ojs/ojchart',
        'ojs/ojlistview',
        'ojs/ojavatar'  
], function (accUtils, ko, $, ArrayDataProvider) {
    function DashboardViewModel() {
    var self = this;

    var url = "js/store_data.json";  //defines link to local data file
    self.activityDataProvider = ko.observable();  //gets data for Activities list
    self.itemsDataProvider = ko.observable();     //gets data for Items list
    self.itemData = ko.observable('');            //holds data for Item details
    self.pieSeriesValue = ko.observableArray([]); //holds data for pie chart

    // Activity selection observables
    self.activitySelected = ko.observable(false);
    self.selectedActivity = ko.observable();
    self.firstSelectedActivity = ko.observable();
          
    // Item selection observables
    self.itemSelected = ko.observable(false);
    self.selectedItem = ko.observable();
    self.firstSelectedItem = ko.observable();

    // Get Activities objects from file using jQuery method and a method to return a Promise
    $.getJSON(url).then(function(data) {
        // Create variable for Activities list and populate using key attribute fetch
        var activitiesArray = data;
        self.activityDataProvider(new ArrayDataProvider(activitiesArray, { keyAttributes: 'id' }));
      }
    );

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */
    self.selectedActivityChanged = function (event) {
      // Check whether click is an Activity selection or a deselection
      if (event.detail.value.length != 0) {
        // If selection, populate and display list
        // Create variable for items list using firstSelectedXxx API from List View
        var itemsArray = self.firstSelectedActivity().data.items;
        // Populate items list using DataProvider fetch on key attribute
        self.itemsDataProvider(new ArrayDataProvider(itemsArray, { keyAttributes: "id" }))
        // Set List View properties
        self.activitySelected(true);
        self.itemSelected(false);
        // Clear item selection
        self.selectedItem([]);
        self.itemData();
      } else {
        // If deselection, hide list
        self.activitySelected(false);
        self.itemSelected(false);
      }
      };

      /**
    * Handle selection from Activity Items list
       */
    self.selectedItemChanged = function (event) {
      // Check whether click is an Activity Item selection or deselection
      if (event.detail.value.length != 0) {
        // If selection, populate and display list
        // Populate items list observable using firstSelectedXxx API
        self.itemData(self.firstSelectedItem().data);
        // Create variable and get attributes of the items list to set pie chart values
        var pieSeries = [
          { name: "Quantity in Stock", items: [self.itemData().quantity_instock] },
          { name: "Quantity Shipped", items: [self.itemData().quantity_shipped] }
        ];
        // Update the pie chart with the data
        self.pieSeriesValue(pieSeries);
        self.itemSelected(true);
      } else {
        // If deselection, hide list
        self.itemSelected(false);
      }
    };

    
    self.connected = function () {
      accUtils.announce("Dashboard page loaded.", "assertive");
      document.title = "Dashboard";
      // Implement further logic if needed
    };

    self.disconnected = function () {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      this.transitionCompleted = () => {
        // Implement if needed
      };
    }

    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return DashboardViewModel;
  }
);
