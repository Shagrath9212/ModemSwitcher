using System.Xml;

namespace HuaweiSwitcher.Models
{
    public class SessionTokenInfo
    {
        public string Error { get; private set; }
        public string SesInfo { get; set; }
        public string TokInfo { get; set; }
        public static SessionTokenInfo Parse(string xml)
        {
            XmlDocument doc = new XmlDocument();
            doc.LoadXml(xml);
            XmlNode error = doc.SelectSingleNode("error");
            if (error != null)
            {
                return new SessionTokenInfo()
                {
                    Error = error.SelectSingleNode("code")?.InnerText
                };
            }
            XmlNode response = doc.SelectSingleNode("response");
            if (response == null)
            {
                return null;
            }

            SessionTokenInfo info = new SessionTokenInfo
            {
                SesInfo = response.SelectSingleNode("SesInfo")?.InnerText,
                TokInfo = response.SelectSingleNode("TokInfo")?.InnerText
            };
            return info;
        }
    }
}