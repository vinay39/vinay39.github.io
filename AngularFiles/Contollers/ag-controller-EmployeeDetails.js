angularModule.controller("EmployeeSaveController", function ($scope, $modal, $log) {

    $scope.EditRecord = [isEditOperation = false, disableEmployeeId = false];

    //   For Additon of New records.
    $scope.currentEmployee = new Employee(null, null, null, null, 0, 0, null);

    //   For Binding the value of employee to the Model Pop Up
    $scope.displayEmployeeDetails = new Employee(null, null, null, null, 0, 0, null);

    //  For Binding the List of Maritial Status drop downn controlat runtime using ng-repeat for <option> tag in select   
    $scope.listofMaritialStatus = [
            { value: '1', text: 'Single' },
            { value: '2', text: 'Married' },
            { value: '3', text: 'Separated' },
            { value: '4', text: 'Divorced' },
            { value: '5', text: 'Widowed' },
            { value: '6', text: 'Others' },
    ];

    //  For Binding the List of Gender Status for checkBox group at runtime using ng-repeat.
    $scope.listofGenders = [
        { value: '0', text: 'Male', selected: 'true' },
        { value: '1', text: 'Female', disabled: 'false' },
        { value: '2', text: 'Others', disabled: 'false' }
    ];

    var empList = [];
    $scope.employeeList = [];

    //  Object Constructor function (type : Parameterised) i.e. Employee to create an Employee Object
    function Employee(empid, name, email, mobile, gen, status, address) {
        this.employeeId = empid;
        this.fullName = name;
        this.emailId = email;
        this.mobileNumber = mobile;
        this.gender = gen;
        this.maritialStatus = status;
        this.address = address;
    };

    //empList.push(new Employee("1", "Vishal Singh", "singhvishal1791992@gmail.com", "9028633528", "Male", "Single", "Kalewadi, Pune"));
    //empList.push(new Employee("2", "Vinay", "vinaysingh@gmail.com", "8149775920", "Male", "Single", "Pimpri, Pune"));

    $scope.employeeList = empList;
    $scope.empCount = Object.keys($scope.employeeList).length;

    //SetLocalStorageData($scope.employeeList); 
    //$scope.employeeList = GetLocalStorageData();

    //  For Addtion and Updation of recod
    $scope.AddEmployee = function (isFormValid) {
        console.log("You have Clicked on Submit button !!! , isFormValid :  " + isFormValid);

        if (isFormValid) {  //  Check that form is valid or not 
            var strMessage = null;
            if ($scope.EditRecord[0] != null && $scope.EditRecord[0] == true) {     // to record updation
                for (var curr = 0; curr < Object.keys($scope.employeeList).length; curr++) {
                    if ($scope.employeeList[curr].employeeId == $scope.currentEmployee.employeeId) {
                        $scope.employeeList[curr].fullName = $scope.currentEmployee.fullName;    // TO Be disabled on Edit
                        $scope.employeeList[curr].emailId = $scope.currentEmployee.emailId;
                        $scope.employeeList[curr].mobileNumber = $scope.currentEmployee.mobileNumber;
                        $scope.employeeList[curr].gender = GetGenderDetails($scope.currentEmployee.gender, 1);
                        $scope.employeeList[curr].maritialStatus = GetMaritialStatusDetails($scope.currentEmployee.maritialStatus, 1);
                        $scope.employeeList[curr].address = $scope.currentEmployee.address;
                        $scope.EditRecord[0] = false;
                        $scope.EditRecord[1] = false;
                    }
                }
                strMessage = 'Record updated successfully';
            }
            else {
                //  for New record insertion into the object list
                $scope.currentEmployee.gender = GetGenderDetails($scope.currentEmployee.gender, 1);
                $scope.currentEmployee.maritialStatus = GetMaritialStatusDetails($scope.currentEmployee.maritialStatus, 1);
                empList.push($scope.currentEmployee);
                $scope.empCount = Object.keys($scope.employeeList).length;
                strMessage = 'Record added successfully';
            }

            $scope.currentEmployee = new Employee(null, null, null, null, 0, 0, null);  //  Clearing the currentEmployee scope object
            $scope.EditRecord[0] = false;
            $scope.EditRecord[1] = false;
            $scope.userForm.$setPristine();     //  Re-setting the un-visited flag to true, A Type of fresh new form
            $scope.userForm.$setValidity();     //  Re-setting the validity flag, A Type of fresh new form

            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();    //  Re-Binding the scope variables with the view
            }
            var dialogInstance = BootstrapDialog.show({
                message: strMessage,
                type: BootstrapDialog.TYPE_INFO     // Displaying success message
            });
        }
        else {
            var dialogInstance = BootstrapDialog.show({
                message: ('Please fill all the details properly.'),
                type: BootstrapDialog.TYPE_WARNING    // Displaying warning message
            });
        }
    };

    /// Click Event of Clear button
    $scope.ClearMe = function () {
        console.log("You have Clicked on Clear button !!! ");
        $scope.currentEmployee = new Employee(null, null, null, null, 0, 0, null);
        $scope.EditRecord[0] = false;
        $scope.EditRecord[1] = false;
        $scope.userForm.$setPristine();     //  Re-setting the un-visited flag to true, A Type of fresh new form
        $scope.userForm.$setValidity();     //  Re-setting the validity flag, A Type of fresh new form        
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();     //  Re-Binding the scope variables with the view
        }
    };

    $scope.DisplayEmployeeDetails = function (employeeId) {
        console.log("You have Clicked on Display button !!!, Employee Id : " + employeeId);

        var recordDetailsFound = false;
        for (var curr = 0; curr < Object.keys($scope.employeeList).length; curr++) {
            if ($scope.employeeList[curr].employeeId == employeeId) {

                // Populating the displayEmployeeDetails object which is further passed to the "View Employee Details" model pop up
                $scope.displayEmployeeDetails = $scope.employeeList[curr];
                recordDetailsFound = true;
            }
        }

        //  Opening the model pop up
        var modalInstance = $modal.open({
            templateUrl: 'AngularFiles/Template/ViewEmployeeDetails.html',
            controller: ModalInstanceCtrl,
            resolve: {
                items: function () {
                    return $scope.displayEmployeeDetails;   //  passing the scope vraibale as a parmeter to model instance 
                }
            }
        });

        //  Fetching the values whihc is returned from the model pop-up
        //  It will be further used in some add-ons in this application.
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });

    };

    //  For Edit Employee. 
    //  Re-Populating the employee details back to the form controls.
    $scope.EditEmployeeDetails = function (employeeId) {
        console.log("You have Clicked on Edit button !!!, Employee Id : " + employeeId);
        for (var curr = 0; curr < Object.keys($scope.employeeList).length; curr++) {
            if ($scope.employeeList[curr].employeeId == employeeId) {
                $scope.currentEmployee.employeeId = $scope.employeeList[curr].employeeId     // TO Be disabled on Edit
                $scope.currentEmployee.fullName = $scope.employeeList[curr].fullName;
                $scope.currentEmployee.emailId = $scope.employeeList[curr].emailId;
                $scope.currentEmployee.mobileNumber = $scope.employeeList[curr].mobileNumber;
                $scope.currentEmployee.gender = GetGenderDetails($scope.employeeList[curr].gender, 2);
                $scope.currentEmployee.maritialStatus = GetMaritialStatusDetails($scope.employeeList[curr].maritialStatus, 2);
                $scope.currentEmployee.address = $scope.employeeList[curr].address;
                $scope.EditRecord[0] = true;
                $scope.EditRecord[1] = true;
            }
        }
    };

    $scope.DeleteEmployeeDetails = function (employeeId) {
        console.log("You have Clicked on Delete button !!!, Employee Id : " + employeeId);

        BootstrapDialog.confirm({
            title: 'CONFIRM',
            message: 'Confirm! Are you sure to perform delete operation ?',
            type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
            closable: true, // <-- Default value is false
            draggable: true, // <-- Default value is false
            btnOKClass: 'btn-danger', // <-- If you didn't specify it, dialog type will be used,
            callback: function (result) {
                // result will be true if button was click, while it will be false if users close the dialog directly.
                if (result) {
                    var recordToBeDeleteFound = false;
                    for (var curr = 0; curr < Object.keys($scope.employeeList).length; curr++) {
                        if ($scope.employeeList[curr].employeeId == employeeId) {
                            //delete $scope.employeeList[curr];
                            $scope.employeeList.splice(curr, 1);
                            recordToBeDeleteFound = true;
                            $scope.empCount = Object.keys($scope.employeeList).length;
                            $scope.currentEmployee = new Employee(null, null, null, null, 0, 0, null);

                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                                $scope.$apply();
                            }

                            var dialogInstance = BootstrapDialog.show({
                                message: 'Record Delete successfully',
                                type: BootstrapDialog.TYPE_SUCCESS
                            });
                        }
                    }
                }
            }
        });
    };

    function GetGenderDetails(gender, type) {
        if (gender != null) {
            if (type == 1) {   //  get Gender Name -> From Gender Value
                for (var currentStatus = 0; currentStatus < Object.keys($scope.listofGenders).length; currentStatus++) {
                    if ($scope.listofGenders[currentStatus].value == gender) {
                        return $scope.listofGenders[currentStatus].text;
                    }
                }
            }
            else if (type == 2) {      //  get From Gender Value  ->  Gender Name
                for (var currentStatus = 0; currentStatus < Object.keys($scope.listofGenders).length; currentStatus++) {
                    if ($scope.listofGenders[currentStatus].text == gender) {
                        return $scope.listofGenders[currentStatus].value;
                    }
                }
            }
        }
    }

    function GetMaritialStatusDetails(status, type) {
        if (status != null) {
            if (type == 1) {   //  get Maritial Status -> From Maritial Value
                for (var currentStatus = 0; currentStatus < Object.keys($scope.listofMaritialStatus).length; currentStatus++) {
                    if ($scope.listofMaritialStatus[currentStatus].value == status) {
                        return $scope.listofMaritialStatus[currentStatus].text;
                    }
                }
            }
            else if (type == 2) {   //  get From Maritial Value -> Maritial Name
                for (var currentStatus = 0; currentStatus < Object.keys($scope.listofMaritialStatus).length; currentStatus++) {
                    if ($scope.listofMaritialStatus[currentStatus].text == status) {
                        return $scope.listofMaritialStatus[currentStatus].value;
                    }
                }
            }
        }
        else {
            if (type == 1) {
                return 'Select';
            }
        }
    }

});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.
var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

    $scope.items = items;

    $scope.selected = { item: $scope.items.fullName };

    $scope.ok = function () { $modalInstance.close($scope.selected.item); };

    $scope.cancel = function () { $modalInstance.dismiss('cancel'); };

};