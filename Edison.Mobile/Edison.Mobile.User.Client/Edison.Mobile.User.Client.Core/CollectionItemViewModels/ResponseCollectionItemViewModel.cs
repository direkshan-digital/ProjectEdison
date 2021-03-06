﻿using System;
using System.Threading.Tasks;
using Autofac;
using Edison.Core.Common.Models;
using Edison.Mobile.Common.Geo;
using Edison.Mobile.Common.Ioc;
using Edison.Mobile.Common.Shared;
using Edison.Mobile.Common.ViewModels;
using Edison.Mobile.User.Client.Core.Network;
using Edison.Mobile.User.Client.Core.ViewModels;

namespace Edison.Mobile.User.Client.Core.CollectionItemViewModels
{
    public class ResponseCollectionItemViewModel : BaseCollectionItemViewModel
    {
        readonly ILocationService locationService;

        public Guid ResponseId { get; private set; }
        public ResponseModel Response { get; private set; }
        public Geolocation Geolocation { get; private set; }

        public event ViewNotification OnResponseReceived;
        public event EventHandler<LocationChangedEventArgs> OnLocationChanged;

        public ResponseCollectionItemViewModel(ResponseLightModel responseLightModel)
        {
            ResponseId = responseLightModel.ResponseId;
            Geolocation = responseLightModel.Geolocation;

            locationService = Container.Instance.Resolve<ILocationService>();
        }

        public async Task GetResponse() 
        {
            var responseRestService = Container.Instance.Resolve<ResponseRestService>();
            var responsesViewModel = Container.Instance.Resolve<ResponsesViewModel>();
            var response = await responseRestService.GetResponse(ResponseId);
            Response = response;
            OnResponseReceived?.Invoke();
            responsesViewModel.HandleResponseModelReceived(response);
        }

        public override void BindEventHandlers()
        {
            base.BindEventHandlers();

            locationService.OnLocationChanged += HandleOnLocationChanged;
        }

        public override void UnBindEventHandlers()
        {
            base.UnBindEventHandlers();

            locationService.OnLocationChanged -= HandleOnLocationChanged;
        }

        void HandleOnLocationChanged(object sender, LocationChangedEventArgs e)
        {
            OnLocationChanged?.Invoke(sender, e);
        }
    }
}
