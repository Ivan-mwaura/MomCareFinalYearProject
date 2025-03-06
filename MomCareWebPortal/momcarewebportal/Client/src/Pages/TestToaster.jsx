
import { useToast } from "../Components/ui/use-toast";


export default function TestToaster() {
  const { toast } = useToast();

  const handleToast = () => {
    toast({
      title: "Success 🎉",
      description: "This is a sample toast notification!",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Test Toaster</h1>
      <button
        onClick={handleToast}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Show Toast
      </button>

    </div>
  );
}
