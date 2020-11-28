using System.Net.Http;
using System.Text;

namespace HuaweiSwitcher
{
    internal class ModemCommandsBodies
    {
        /// <summary>
        /// For modem reboot
        /// </summary>
        internal static StringContent RebootCommand()
        {
            return new StringContent("<?xml version=\"1.0\" encoding=\"UTF-8\"?><request><Control>1</Control></request>", Encoding.UTF8, "application/xml");
        }
    }
}