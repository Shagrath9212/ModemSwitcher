using System.Net.Http;
using System.Threading.Tasks;
using HuaweiSwitcher.Models;

namespace HuaweiSwitcher
{
    public class HuaweiModem
    {
        private readonly string ApiUri;
        public HuaweiModem(string gateway)
        {
            ApiUri = $"http://{gateway}/api";
        }

        public async Task Reboot()
        {
            SessionTokenInfo tokenInfo = await GetSessionInfo();
            if (!string.IsNullOrEmpty(tokenInfo.Error))
            {
                throw new System.Exception(tokenInfo.Error);
            }
            string uri = ApiUri + "/device/control";
            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("Cookie", tokenInfo.SesInfo);
                client.DefaultRequestHeaders.Add("__RequestVerificationToken", tokenInfo.TokInfo);

                HttpResponseMessage responseMessage = await client.PostAsync(uri, ModemCommandsBodies.RebootCommand());
                string response = await responseMessage.Content.ReadAsStringAsync();
            }
        }

        private async Task<SessionTokenInfo> GetSessionInfo()
        {
            string uri = ApiUri + "/webserver/SesTokInfo";
            using (HttpClient client = new HttpClient())
            {
                HttpResponseMessage responceMessage = await client.GetAsync(uri);
                string responce = await responceMessage.Content.ReadAsStringAsync();
                SessionTokenInfo info = Models.SessionTokenInfo.Parse(responce);
                return info;
            }
        }
    }
}