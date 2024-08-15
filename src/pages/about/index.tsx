import MyNav from "@/components/myNav";
import TextHeader from "@/components/textHeader";


function ContactPage() {
  return (
    <div>
      <div className="flex flex-col items-center">
        <TextHeader>Github</TextHeader>

        <div className="bg-green-200 w-full text-black text-center py-20">
          about us. bla bla...
        </div>


        <div className="flex flex-col">
          <a href="https://github.com/Dev4Geo/Dev4Geo">main repository</a>
          <a href="https://github.com/Dev4Geo/Dev4Geo_web">this website</a>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
