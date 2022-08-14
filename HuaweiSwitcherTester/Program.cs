using System;
using System.Threading.Tasks;

namespace HuaweiSwitcherTester
{
    class Program
    {
        static void Main(string[] args)
        {
            Task t = Task.Run(() => Test());
            t.Wait();
            Console.WriteLine("Hello World!");
        }
        public static async Task Test()
        {
            var modem = new HuaweiSwitcher.HuaweiModem("192.168.8.1");
            await modem.RebootAsync();
        }
    }
}